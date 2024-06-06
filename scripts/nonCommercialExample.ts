import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions for running this non-commercial example.

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.storyprotocol.xyz/docs/typescript-sdk-setup
    const config: StoryConfig = {
        account: account,
        transport: http(RPCProviderUrl),
        chainId: 'sepolia',
    }
    const client = StoryClient.newClient(config)

    // 2. Register an IP Asset
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-an-nft-as-an-ip-asset
    const tokenId = await mintNFT()
    const registeredIpAssetResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: tokenId,
        metadata: {
            metadataURI: 'test-uri',
            metadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAssetResponse.txHash}, IPA ID: ${registeredIpAssetResponse.ipId}`)

    // 3. Attach License Terms to IP
    //
    // Docs: https://docs.storyprotocol.xyz/docs/attach-terms-to-an-ip-asset
    try {
        const attachLicenseTermsResponse = await client.license.attachLicenseTerms({
            licenseTermsId: NonCommercialSocialRemixingTermsId,
            ipId: registeredIpAssetResponse.ipId as Address,
            txOptions: { waitForTransaction: true },
        })
        console.log(`Attached License Terms to IP at transaction hash ${attachLicenseTermsResponse.txHash}`)
    } catch (e) {
        console.log(`License Terms ID ${NonCommercialSocialRemixingTermsId} already attached to this IPA.`)
    }

    // 4. Mint License
    //
    // Docs: https://docs.storyprotocol.xyz/docs/mint-a-license
    const mintLicenseResponse = await client.license.mintLicenseTokens({
        licenseTermsId: NonCommercialSocialRemixingTermsId,
        licensorIpId: registeredIpAssetResponse.ipId as Address,
        receiver: account.address,
        amount: 1,
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `License Token minted at transaction hash ${mintLicenseResponse.txHash}, License IDs: ${mintLicenseResponse.licenseTokenIds}`
    )

    // 5. Mint deriviative IP Asset using your license
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-ipa-as-derivative#register-derivative-using-license-token
    const derivativeTokenId = await mintNFT()
    const registeredIpAssetDerivativeResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: derivativeTokenId,
        metadata: {
            metadataURI: 'test-uri',
            metadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Derivative IPA created at transaction hash ${registeredIpAssetDerivativeResponse.txHash}, IPA ID: ${registeredIpAssetDerivativeResponse.ipId}`
    )
    const linkDerivativeResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
        childIpId: registeredIpAssetDerivativeResponse.ipId as Address,
        licenseTokenIds: mintLicenseResponse.licenseTokenIds as bigint[],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative IPA linked to parent at transaction hash ${linkDerivativeResponse.txHash}`)
}

main()
