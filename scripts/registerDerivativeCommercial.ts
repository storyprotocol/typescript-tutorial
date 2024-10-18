import {
    ClaimRevenueResponse,
    CollectRoyaltyTokensResponse,
    PIL_TYPE,
    RegisterDerivativeResponse,
    RegisterIpAndAttachPilTermsResponse,
    RegisterIpAndMakeDerivativeResponse,
    RegisterIpResponse,
    SnapshotResponse,
    StoryClient,
    StoryConfig,
} from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { CurrencyAddress, NFTContractAddress, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Register Derivative Commercial" example.

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
    const tokenId = await mintNFT(account.address, 'test-uri')
    const registerIpResponse: RegisterIpAndAttachPilTermsResponse = await client.ipAsset.registerIpAndAttachPilTerms({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
        pilType: PIL_TYPE.COMMERCIAL_USE,
        mintingFee: 1,
        currency: CurrencyAddress,
        // NOTE: The below metadata is not configured properly. It is just to make things simple.
        // See `simpleMintAndRegister.ts` for a proper example.
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Root IPA created at transaction hash ${registerIpResponse.txHash}, IPA ID: ${registerIpResponse.ipId}, License Terms ID: ${registerIpResponse.licenseTermsId}`
    )

    // 3. Register another (child) IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const derivativeTokenId = await mintNFT(account.address, 'test-uri')
    const registerIpDerivativeResponse: RegisterIpResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: derivativeTokenId!,
        // NOTE: The below metadata is not configured properly. It is just to make things simple.
        // See `simpleMintAndRegister.ts` for a proper example.
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Derivative IPA created at transaction hash ${registerIpDerivativeResponse.txHash}, IPA ID: ${registerIpDerivativeResponse.ipId}`
    )

    // 4. Make the Child IP Asset a Derivative of the Parent IP Asset
    //
    // Docs: https://docs.story.foundation/docs/spg-functions#register--derivative
    const linkDerivativeResponse: RegisterDerivativeResponse = await client.ipAsset.registerDerivative({
        childIpId: registerIpDerivativeResponse.ipId as Address,
        parentIpIds: [registerIpResponse.ipId as Address],
        licenseTermsIds: [registerIpResponse.licenseTermsId as bigint],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative linked at transaction hash ${linkDerivativeResponse.txHash}`)

    ////
    // NOTE FOR THE FOLLOWING SECTIONS: This is not a very good
    // example of royalty because there isn't any royalty to collect.
    // If someone had minted a derivative of the derivative and paid
    // money to mint the License Token to do so, then the root IP Asset
    // could claim some revenue. This is just here to show you how it
    // would be done.
    // Furthermore, it may not even work in practice because
    // snapshotting too soon after royalty collection may not work.
    // Again, this is just to show you what code would look like.
    ////

    // 5. Collect Royalty Tokens
    //
    // Docs: https://docs.story.foundation/docs/collect-and-claim-royalty#collect-royalty-tokens
    const collectRoyaltyTokensResponse: CollectRoyaltyTokensResponse = await client.royalty.collectRoyaltyTokens({
        parentIpId: registerIpResponse.ipId as Address,
        royaltyVaultIpId: registerIpDerivativeResponse.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Collected royalty token ${collectRoyaltyTokensResponse.royaltyTokensCollected} at transaction hash ${collectRoyaltyTokensResponse.txHash}`
    )

    // 6. Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/collect-and-claim-royalty#claim-revenue
    const snapshotResponse: SnapshotResponse = await client.royalty.snapshot({
        royaltyVaultIpId: registerIpDerivativeResponse.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Took a snapshot with ID ${snapshotResponse.snapshotId} at transaction hash ${snapshotResponse.txHash}`)
    const claimRevenueResponse: ClaimRevenueResponse = await client.royalty.claimRevenue({
        snapshotIds: [snapshotResponse.snapshotId as bigint],
        royaltyVaultIpId: registerIpDerivativeResponse.ipId as Address,
        token: CurrencyAddress,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Claimed revenue token ${claimRevenueResponse.claimableToken} at transaction hash ${claimRevenueResponse.txHash}`)
}

main()
