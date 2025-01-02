import { IpMetadata, RegisterIpAndAttachPilTermsResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, RPCProviderUrl, account } from './utils/utils'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'

const main = async () => {
    try {
        // 1. Set up your Story Config
        //
        // Docs: https://docs.story.foundation/docs/typescript-sdk-setup
        const config: StoryConfig = {
            account: account,
            transport: http(RPCProviderUrl),
            chainId: 'odyssey',
        }
        const client = StoryClient.newClient(config)
        console.log('Story Client initialized.')

        // 2. Set up your IP Metadata
        //
        // Docs: https://docs.story.foundation/docs/ipa-metadata-standard
        const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
            title: 'My IP Asset',
            description: 'This is a test IP asset',
            attributes: [
                {
                    key: 'Rarity',
                    value: 'Legendary',
                },
            ],
        })
        console.log('IP Metadata generated:', ipMetadata)

        // 3. Set up your NFT Metadata
        //
        // Docs: https://eips.ethereum.org/EIPS/eip-721
        const nftMetadata = {
            name: 'NFT representing ownership of IP Asset',
            description: 'This NFT represents ownership of an IP Asset',
            image: 'https://i.imgur.com/gb59b2S.png',
        }
        console.log('NFT Metadata prepared:', nftMetadata)

        // 4. Upload Metadata to IPFS
        console.log('Uploading metadata to IPFS...')
        const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
        const ipHash: `0x${string}` = `0x${createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')}`
        const nftHash: `0x${string}` = `0x${createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')}`

        const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
        console.log('IPFS upload successful:')
        console.log('IP Metadata Hash:', ipHash)
        console.log('NFT Metadata Hash:', nftHash)

        // 5. Mint an NFT
        console.log('Minting NFT...')
        const tokenId = await mintNFT(account.address, `https://ipfs.io/ipfs/${nftIpfsHash}`)
        if (!tokenId) throw new Error('Failed to mint NFT.')
        console.log(`NFT minted successfully with tokenId: ${tokenId}`)

        // 6. Register an IP Asset
        //
        // Docs: https://docs.story.foundation/docs/attach-terms-to-an-ip-asset#register-new-ip-asset-and-attach-license-terms
        console.log('Registering IP Asset...')
        const response: RegisterIpAndAttachPilTermsResponse = await client.ipAsset.registerIpAndAttachPilTerms({
            nftContract: NFTContractAddress,
            tokenId: tokenId.toString(), // Convert tokenId to string
            terms: [], // Add terms if applicable
            ipMetadata: {
                ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                ipMetadataHash: ipHash,
                nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
                nftMetadataHash: nftHash,
            },
            txOptions: { waitForTransaction: true },
        })
        console.log(`Root IPA created at transaction hash: ${response.txHash}, IPA ID: ${response.ipId}`)
        console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`)
    } catch (error) {
        console.error('An error occurred:', error)
    }
}

main()
