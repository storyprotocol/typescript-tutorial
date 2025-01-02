import { RegisterIpAndAttachPilTermsResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, RPCProviderUrl, account } from './utils/utils'

// BEFORE RUNNING: Ensure proper setup as per the README instructions.

const validateSetup = () => {
    if (!RPCProviderUrl) throw new Error('RPCProviderUrl is not set.')
    if (!NFTContractAddress) throw new Error('NFTContractAddress is not set.')
    if (!account || !account.address) throw new Error('Account configuration is missing.')
}

const registerIpAsset = async (
    client: StoryClient,
    tokenId: string // Ensure this expects a string
): Promise<RegisterIpAndAttachPilTermsResponse> => {
    return await client.ipAsset.registerIpAndAttachPilTerms({
        nftContract: NFTContractAddress,
        tokenId: tokenId, // Now safely passed as a string
        terms: [],
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
}

const raiseDispute = async (client: StoryClient, ipId: Address) => {
    return await client.dispute.raiseDispute({
        targetIpId: ipId,
        // "PLAGIARISM" in base32, currently the only whitelisted tag for protocol v1.2
        targetTag: '0x504c414749415249534d00000000000000000000000000000000000000000000',
        cid: 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
    })
}

const main = async function () {
    try {
        // 1. Validate setup
        validateSetup()

        // 2. Set up Story Config
        console.log('Setting up Story configuration...')
        const config: StoryConfig = {
            account: account,
            transport: http(RPCProviderUrl),
            chainId: 'odyssey', // Change if you're using a different chain.
        }
        const client = StoryClient.newClient(config)

        // 3. Mint an NFT
        console.log('Minting NFT...')
        const tokenId = await mintNFT(account.address, 'test-uri')
        if (!tokenId) throw new Error('Failed to mint NFT.')

        // 4. Register IP Asset
        console.log('Registering IP Asset...')
        const ipResponse = await registerIpAsset(client, tokenId.toString())
        console.log(`Root IPA created at transaction hash: ${ipResponse.txHash}`)
        console.log(`IPA ID: ${ipResponse.ipId}`)
        console.log(`View on the explorer: https://explorer.story.foundation/ipa/${ipResponse.ipId}`)

        // 5. Raise a Dispute
        console.log('Raising a dispute...')
        const disputeResponse = await raiseDispute(client, ipResponse.ipId as Address)
        console.log(`Dispute raised at transaction hash: ${disputeResponse.txHash}`)
        console.log(`Dispute ID: ${disputeResponse.disputeId}`)
    } catch (error) {
        console.error('An error occurred:', error)
    }
}

main()
