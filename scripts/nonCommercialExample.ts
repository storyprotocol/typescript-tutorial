import {
    AttachLicenseTermsResponse,
    MintLicenseTokensResponse,
    RegisterDerivativeWithLicenseTokensResponse,
    RegisterIpResponse,
    RegisterPILResponse,
    StoryClient,
    StoryConfig,
} from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions for running this non-commercial example.

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
    // Note: This is totally useless, because of two reasons:
    //  1. Non-commercial terms are already attached to an IP by default.
    //  2. Non-commercial terms are already registered as a license with id == 1.
    // The only reason this is here is to show you how to register PIL terms.
    //
    // Docs: https://docs.story.foundation/docs/register-pil-terms#create-a-non-commercial-social-remixing-license
    const nonComSocialRemixingParams = {}
    const registerPILTermsResponse: RegisterPILResponse = await client.license.registerNonComSocialRemixingPIL({
        ...nonComSocialRemixingParams,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `PIL Terms registered at transaction hash ${registerPILTermsResponse.txHash}, License Terms ID: ${registerPILTermsResponse.licenseTermsId}`
    )

    // 4. Attach License Terms to IP
    //
    // Note: This will ALWAYS return a false success, because non-commercial terms are
    // attached to an IP by default. This is just to show you how to attach terms.
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
    const mintLicenseResponse: MintLicenseTokensResponse = await client.license.mintLicenseTokens({
        licenseTermsId: NonCommercialSocialRemixingTermsId,
        licensorIpId: registeredIpAssetResponse.ipId as Address,
        receiver: account.address,
        amount: 1,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `License Token minted at transaction hash ${mintLicenseResponse.txHash}, License IDs: ${mintLicenseResponse.licenseTokenIds}`
    )

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
}

main()
