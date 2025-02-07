import { IpMetadata } from '@story-protocol/core-sdk'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, account, client } from './utils/utils'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Simple Mint and Register" example.

const main = async function () {
    // 1. Set up your IP Metadata
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

    // 2. Set up your NFT Metadata
    //
    // Docs: https://eips.ethereum.org/EIPS/eip-721
    const nftMetadata = {
        name: 'NFT representing ownership of IP Asset',
        description: 'This NFT represents ownership of an IP Asset',
        image: 'https://i.imgur.com/gb59b2S.png',
    }

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    // 4. Mint an NFT
    const tokenId = await mintNFT(account.address, `https://ipfs.io/ipfs/${nftIpfsHash}`)
    console.log(`NFT minted with tokenId ${tokenId}`)

    // 5. Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/attach-terms-to-an-ip-asset#register-new-ip-asset-and-attach-license-terms
    const response = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
    console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`)
}

main()
