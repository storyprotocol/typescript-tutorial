import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const main = async function () {
    // Set up your wallet for this tutorial.
    // 1. Add your private key here, either directly or in an .env file
    // 2. Add your RPC provider URL here, either directly or in an .env file
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY! as Address)
    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
    }
    const client = StoryClient.newClient(config)

    // 1. Register IP Asset
    const myNftAddress = '0xcd3a91675b990f27eb544b85cdb6844573b66a43'
    const myNftTokenId = '110'

    const registeredIpAsset = await client.ipAsset.registerRootIp({
        tokenContractAddress: myNftAddress,
        tokenId: myNftTokenId,
        policyId: '0',
        txOptions: { waitForTransaction: true },
    })

    console.log(`Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`)

    // 2. Create PIL Policy
    const pilPolicy = await client.policy.registerPILPolicy({
        transferable: true,
        commercialRevShare: 5,
        txOptions: { waitForTransaction: true },
    })
    console.log(`PIL Policy registered at transaction hash ${pilPolicy.txHash}, Policy ID: ${pilPolicy.policyId}`)

    // 3. Attach Policy to IP
    const attachPolicyResponse = await client.policy.addPolicyToIp({
        policyId: pilPolicy.policyId as string,
        ipId: registeredIpAsset.ipId as Address,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Attached Policy to IP at transaction hash ${attachPolicyResponse.txHash}, index: ${attachPolicyResponse.index}`)

    // 4. Mint License
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
