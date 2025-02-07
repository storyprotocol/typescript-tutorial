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
    const ipResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: tokenId!,
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
        // NOTE: you must use your own CID here, because every time it is used,
        // the protocol does not allow you to use it again
        cid: 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
        // you must pick from one of the whitelisted tags here: https://docs.story.foundation/docs/dispute-module#/dispute-tags
        targetTag: 'IMPROPER_REGISTRATION',
        bond: 0,
        liveness: 2592000,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`)
}

main()
