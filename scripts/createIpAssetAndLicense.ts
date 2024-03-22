import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, Address } from 'viem'
import { mintNFT } from './mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingPolicyId, RPCProviderUrl, account } from '../utils'

// BEFORE YOU RUN THIS FUNCTION:
// 1. Add WALLET_PRIVATE_KEY to your .env

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.storyprotocol.xyz/docs/typescript-sdk-setup
    const config: StoryConfig = {
        account: account,
        transport: http(RPCProviderUrl),
    }
    const client = StoryClient.newClient(config)

    // 2. Register an IP Asset
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-an-nft-as-an-ip-asset
    const tokenId = await mintNFT()
    const registeredIpAssetResponse = await client.ipAsset.registerRootIp({
        tokenContractAddress: NFTContractAddress,
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
        const attachPolicyResponse = await client.policy.addPolicyToIp({
            policyId: NonCommercialSocialRemixingPolicyId,
            ipId: registeredIpAssetResponse.ipId as `0x${string}`,
            txOptions: { waitForTransaction: true },
        })
        console.log(`Attached Policy to IP at transaction hash ${attachPolicyResponse.txHash}, index: ${attachPolicyResponse.index}`)
    } catch (e) {
        console.log(`Policy ID ${NonCommercialSocialRemixingPolicyId} already attached to IPA ID ${registeredIpAssetResponse.ipId}`)
    }

    // 4. Mint License
    //
    // Docs: https://docs.storyprotocol.xyz/docs/mint-license
    const mintLicenseResponse = await client.license.mintLicense({
        policyId: NonCommercialSocialRemixingPolicyId as string,
        licensorIpId: registeredIpAssetResponse.ipId as `0x${string}`,
        receiverAddress: account.address,
        mintAmount: 1,
        txOptions: { waitForTransaction: true },
    })
    console.log(`License minted at transaction hash ${mintLicenseResponse.txHash}, license id: ${mintLicenseResponse.licenseId}`)

    // 5. Mint deriviative IP Asset using your license
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-an-nft-as-an-ipa-remix
    const derivativeTokenId = await mintNFT()
    const registeredDerivativeIpAssetResponse = await client.ipAsset.registerDerivativeIp({
        tokenContractAddress: NFTContractAddress,
        tokenId: derivativeTokenId,
        licenseIds: [mintLicenseResponse.licenseId as `0x${string}`],
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `Remixed IPA created at transaction hash ${registeredDerivativeIpAssetResponse.txHash}, IPA ID: ${registeredDerivativeIpAssetResponse.ipId}`
    )
}

main()
