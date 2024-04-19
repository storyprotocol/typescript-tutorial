import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { mintNFT } from './mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, RPCProviderUrl, account } from '../utils'

// BEFORE YOU RUN THIS FUNCTION:
// 1. Add WALLET_PRIVATE_KEY to your .env

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
        tokenContract: NFTContractAddress,
        tokenId: tokenId,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAssetResponse.txHash}, IPA ID: ${registeredIpAssetResponse.ipId}`)

    // 3. Attach Policy to IP
    //
    // Note: You can also provide the policyId directly
    // when you mint an IP Asset by providing `policyId`
    // as a parameter to `registerRootIp`.
    //
    // Docs: https://docs.storyprotocol.xyz/docs/attach-policy-to-ip-asset
    try {
        const attachPolicyResponse = await client.license.attachLicenseTerms({
            licenseTermsId: NonCommercialSocialRemixingTermsId,
            ipId: registeredIpAssetResponse.ipId as `0x${string}`,
            txOptions: { waitForTransaction: true },
        })
        console.log(`Attached License Terms to IP at transaction hash ${attachPolicyResponse.txHash}`)
    } catch (e) {
        console.log(`License Terms ID ${NonCommercialSocialRemixingTermsId} already attached to IPA ID ${registeredIpAssetResponse.ipId}`)
    }

    // 4. Mint License
    //
    // Docs: https://docs.storyprotocol.xyz/docs/mint-license
    const mintLicenseResponse = await client.license.mintLicenseTokens({
        licenseTermsId: NonCommercialSocialRemixingTermsId as string,
        licensorIpId: registeredIpAssetResponse.ipId as `0x${string}`,
        receiver: account.address,
        amount: 1,
        txOptions: { waitForTransaction: true },
    })
    console.log(`License Token minted at transaction hash ${mintLicenseResponse.txHash}, license id: ${mintLicenseResponse.licenseTokenId}`)

    // 5. Mint deriviative IP Asset using your license
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-an-nft-as-an-ipa-remix
    const derivativeTokenId = await mintNFT()
    const registeredIpAssetDerivativeResponse = await client.ipAsset.register({
        tokenContract: NFTContractAddress,
        tokenId: derivativeTokenId,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative IPA created at transaction hash ${registeredIpAssetResponse.txHash}, IPA ID: ${registeredIpAssetResponse.ipId}`)
    const registeredDerivativeIpAssetResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
        childIpId: registeredIpAssetDerivativeResponse.ipId!,
        licenseTokenIds: [mintLicenseResponse.licenseTokenId!],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative IPA created at transaction hash ${registeredDerivativeIpAssetResponse.txHash}`)
}

main()
