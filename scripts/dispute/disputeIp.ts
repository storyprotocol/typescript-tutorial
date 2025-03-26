import { Address, parseEther } from 'viem'
import { client } from '../../utils/config'
import * as sha256 from 'multiformats/hashes/sha2'
import { CID } from 'multiformats/cid'

// TODO: Replace with your own IP ID
const IP_ID: Address = '0x876B03d1e756C5C24D4b9A1080387098Fcc380f5'

const main = async function () {
    // NOTE: Every time `raiseDispute` is called, it needs to be called with
    // a unique CID. The CID representes dispute evidence.
    // For testing purposes, we use a `generateCID` function.
    const randomCid = await generateCID()

    // 1. Raise a Dispute
    //
    // Docs: https://docs.story.foundation/sdk-reference/dispute#raisedispute
    const disputeResponse = await client.dispute.raiseDispute({
        targetIpId: IP_ID,
        cid: randomCid,
        // you must pick from one of the whitelisted tags here:
        // https://docs.story.foundation/concepts/dispute-module/overview#dispute-tags
        targetTag: 'IMPROPER_REGISTRATION',
        bond: parseEther('0.1'),
        liveness: 2592000,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`)
}

// example function just for demo purposes
const generateCID = async () => {
    // Generate a random 32-byte buffer
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    // Hash the bytes using SHA-256
    const hash = await sha256.sha256.digest(randomBytes)
    // Create a CIDv1 in dag-pb format
    const cidv1 = CID.createV1(0x70, hash) // 0x70 = dag-pb codec
    // Convert CIDv1 to CIDv0 (Base58-encoded)
    return cidv1.toV0().toString()
}

main()
