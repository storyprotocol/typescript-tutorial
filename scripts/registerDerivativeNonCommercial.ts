import { RegisterIpAndMakeDerivativeResponse, RegisterIpResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions
// for running this "Register Derivative Non-Commercial" example.

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
    const registeredIpResponse: RegisterIpResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
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
    console.log(`Root IPA created at transaction hash ${registeredIpResponse.txHash}, IPA ID: ${registeredIpResponse.ipId}`)

    // 3. Register a Derivative IP Asset
    //
    // Docs: https://docs.story.foundation/docs/spg-functions#register--derivative
    const derivativeTokenId = await mintNFT(account.address, 'test-uri')
    const registeredIpDerivativeResponse: RegisterIpAndMakeDerivativeResponse = await client.ipAsset.registerDerivativeIp({
        nftContract: NFTContractAddress,
        tokenId: derivativeTokenId!,
        derivData: {
            parentIpIds: [registeredIpResponse.ipId as Address],
            licenseTermsIds: [NonCommercialSocialRemixingTermsId],
        },
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
        `Derivative IPA created at transaction hash ${registeredIpDerivativeResponse.txHash}, IPA ID: ${registeredIpDerivativeResponse.ipId}`
    )
}

main()
