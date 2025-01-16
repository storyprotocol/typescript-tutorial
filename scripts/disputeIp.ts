import { Address, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, account, client } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Dispute" example.

const main = async function () {
    // 1. Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const tokenId = await mintNFT(account.address, 'test-uri')
    const ipResponse = await client.ipAsset.registerIpAndAttachPilTerms({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
        terms: [],
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${ipResponse.txHash}, IPA ID: ${ipResponse.ipId}`)
    console.log(`View on the explorer: https://explorer.story.foundation/ipa/${ipResponse.ipId}`)

    // 2. Raise a Dispute
    //
    // Docs: https://docs.story.foundation/docs/dispute-module
    const disputeResponse = await client.dispute.raiseDispute({
        targetIpId: ipResponse.ipId as Address,
        // this is "PLAGIARISM" in base32, and is currently the only whitelisted
        // tag for protocol v1.2
        targetTag: '0x504c414749415249534d00000000000000000000000000000000000000000000',
        cid: 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
    })
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`)
}

main()
