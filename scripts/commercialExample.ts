import {
    AttachLicenseTermsResponse,
    ClaimRevenueResponse,
    CollectRoyaltyTokensResponse,
    MintLicenseTokensResponse,
    RegisterDerivativeWithLicenseTokensResponse,
    RegisterIpResponse,
    RegisterPILResponse,
    SnapshotResponse,
    StoryClient,
    StoryConfig,
} from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { CurrencyAddress, NFTContractAddress, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions for running this commercial example.

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.story.foundation/docs/typescript-sdk-setup
    const config: StoryConfig = {
        account: account,
        transport: http(RPCProviderUrl),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)

    // 2. Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const tokenId = await mintNFT()
    const registeredIpAssetResponse: RegisterIpResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAssetResponse.txHash}, IPA ID: ${registeredIpAssetResponse.ipId}`)

    // 3. Register PIL Terms
    //
    // Docs: https://docs.story.foundation/docs/register-pil-terms#create-a-commercial-use-license
    const commercialUseParams = {
        currency: CurrencyAddress,
        defaultMintingFee: '1',
    }
    const registerPILTermsResponse: RegisterPILResponse = await client.license.registerCommercialUsePIL({
        ...commercialUseParams,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `PIL Terms registered at transaction hash ${registerPILTermsResponse.txHash}, License Terms ID: ${registerPILTermsResponse.licenseTermsId}`
    )

    // 4. Attach License Terms to IP
    //
    // Docs: https://docs.story.foundation/docs/attach-terms-to-an-ip-asset

    const attachLicenseTermsResponse: AttachLicenseTermsResponse = await client.license.attachLicenseTerms({
        licenseTermsId: registerPILTermsResponse.licenseTermsId as bigint,
        ipId: registeredIpAssetResponse.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    if (attachLicenseTermsResponse.success) {
        console.log(`Attached License Terms to IP at transaction hash ${attachLicenseTermsResponse.txHash}`)
    } else {
        console.log(`License Terms ID ${registerPILTermsResponse.licenseTermsId} already attached to this IPA.`)
    }

    // 5. Mint License
    //
    // Docs: https://docs.story.foundation/docs/mint-a-license
    let mintLicenseResponse: MintLicenseTokensResponse
    try {
        mintLicenseResponse = await client.license.mintLicenseTokens({
            licenseTermsId: registerPILTermsResponse.licenseTermsId as bigint,
            licensorIpId: registeredIpAssetResponse.ipId as Address,
            receiver: account.address,
            amount: 1,
            txOptions: { waitForTransaction: true },
        })
        console.log(
            `License Token minted at transaction hash ${mintLicenseResponse.txHash}, License IDs: ${mintLicenseResponse.licenseTokenIds}`
        )
    } catch (e) {
        console.log(`
            ERROR: If you're seeing this error, it's mosty likely because you haven't followed 
            the instructions in the README file. You must first mint SUSD and then approve the royalty 
            contract to spend it on your behalf. Please see the README for more details.
        `)
        return
    }

    // 6. Mint deriviative IP Asset using your license
    //
    // Docs: https://docs.story.foundation/docs/register-ipa-as-derivative#register-derivative-using-license-token
    const derivativeTokenId = await mintNFT()
    const registeredIpAssetDerivativeResponse: RegisterIpResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: derivativeTokenId!,
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Derivative IPA created at transaction hash ${registeredIpAssetDerivativeResponse.txHash}, IPA ID: ${registeredIpAssetDerivativeResponse.ipId}`
    )
    const linkDerivativeResponse: RegisterDerivativeWithLicenseTokensResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
        childIpId: registeredIpAssetDerivativeResponse.ipId as Address,
        licenseTokenIds: mintLicenseResponse.licenseTokenIds as bigint[],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative IPA linked to parent at transaction hash ${linkDerivativeResponse.txHash}`)

    ////
    // NOTE FOR THE FOLLOWING SECTIONS: This is not a very good
    // example of royalty because there isn't any royalty to collect.
    // If someone had minted a derivative of the derivative and paid
    // money to mint the License Token to do so, then the root IP Asset
    // could claim some revenue. This is just here to show you how it
    // would be done.
    ////

    // 7. Collect Royalty Tokens
    //
    // Docs: https://docs.story.foundation/docs/collect-and-claim-royalty#collect-royalty-tokens
    const collectRoyaltyTokensResponse: CollectRoyaltyTokensResponse = await client.royalty.collectRoyaltyTokens({
        parentIpId: registeredIpAssetResponse.ipId as Address,
        royaltyVaultIpId: registeredIpAssetDerivativeResponse.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Collected royalty token ${collectRoyaltyTokensResponse.royaltyTokensCollected} at transaction hash ${collectRoyaltyTokensResponse.txHash}`
    )

    // 8. Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/collect-and-claim-royalty#claim-revenue
    const snapshotResponse: SnapshotResponse = await client.royalty.snapshot({
        royaltyVaultIpId: registeredIpAssetDerivativeResponse.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Took a snapshot with ID ${snapshotResponse.snapshotId} at transaction hash ${snapshotResponse.txHash}`)
    const claimRevenueResponse: ClaimRevenueResponse = await client.royalty.claimRevenue({
        snapshotIds: [snapshotResponse.snapshotId as bigint],
        royaltyVaultIpId: registeredIpAssetDerivativeResponse.ipId as Address,
        token: CurrencyAddress,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Claimed revenue token ${claimRevenueResponse.claimableToken} at transaction hash ${claimRevenueResponse.txHash}`)
}

main()
