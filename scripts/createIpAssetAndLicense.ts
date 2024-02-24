import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mintNFT } from './mintNFT'

const main = async function () {
    // 1. Set up your wallet for this tutorial.
    // - Add your private key to your .env file.
    // - Add your rpc provider url to your .env file 
    //      - We recommend the Sepolia test network: https://rpc.ankr.com/eth_sepolia
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Address)
    const config: StoryConfig = {
        account,
        transport: http(process.env.RPC_PROVIDER_URL),
    }
    const client = StoryClient.newClient(config)

    // 2. If no token ID is provided, we will mint a new one from the NFT contract.
    const tokenId = process.env.MY_NFT_TOKEN_ID || await mintNFT();

    // 3. Register an NFT as an IP Asset
    const registeredIpAsset = await client.ipAsset.registerRootIp({
        tokenContractAddress: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
        tokenId: tokenId,
        policyId: '0',
        txOptions: { waitForTransaction: true }
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`)

    // 4. Create "Non-Commercial Social Remixing" PIL Policy
    const nonCommercialSocialRemixingParams = {
        transferable: true,
        attribution: true,
        commercialUse: false,
        derivativesAttribution: true,
        derivativesAllowed: true,
        derivativesApproval: true,
        derivativesReciprocal: true,
    }

    const pilPolicy = await client.policy.registerPILPolicy({
        ...nonCommercialSocialRemixingParams,
        txOptions: { waitForTransaction: true },
    })
    console.log(`PIL Policy registered at transaction hash ${pilPolicy.txHash}, Policy ID: ${pilPolicy.policyId}`)

    try {
        // 5. Attach Policy to IP
        const attachPolicyResponse = await client.policy.addPolicyToIp({
            policyId: pilPolicy.policyId as string,
            ipId: registeredIpAsset.ipId as Address,
            txOptions: { waitForTransaction: true },
        })
        console.log(`Attached Policy to IP at transaction hash ${attachPolicyResponse.txHash}, index: ${attachPolicyResponse.index}`);
    } catch (e) {
        console.log(`Policy ID ${pilPolicy.policyId} already attached to IPA ID ${registeredIpAsset.ipId}`);
    }

    // 6. Mint License
    const mintLicenseResponse = await client.license.mintLicense({
        policyId: pilPolicy.policyId as string,
        licensorIpId: registeredIpAsset.ipId as `0x${string}`,
        receiverAddress: account.address, // This should be optional
        mintAmount: 1, // How many licenses to mint
        txOptions: { waitForTransaction: true },
    })
    console.log(`License minted at transaction hash ${mintLicenseResponse.txHash}, license id: ${mintLicenseResponse.licenseId}`)
}

main()
