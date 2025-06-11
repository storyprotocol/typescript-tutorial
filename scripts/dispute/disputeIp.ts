import { Address, parseEther } from 'viem'
import { client } from '../../utils/config'
import * as sha256 from 'multiformats/hashes/sha2'
import { CID } from 'multiformats/cid'
import { uploadTextToIPFS } from '../../utils/functions/uploadToIpfs'
import { DisputeTargetTag } from '@story-protocol/core-sdk'

// TODO: Replace with your own IP ID and fill out your evidence
const IP_ID: Address = '0x876B03d1e756C5C24D4b9A1080387098Fcc380f5'
const EVIDENCE: string = 'Fill out your evidence here.'

const main = async function () {
    const disputeHash = await uploadTextToIPFS(EVIDENCE)
    console.log(`Dispute evidence uploaded to IPFS: ${disputeHash}`)

    // Raise a Dispute
    //
    // Docs: https://docs.story.foundation/sdk-reference/dispute#raisedispute
    const disputeResponse = await client.dispute.raiseDispute({
        targetIpId: IP_ID,
        cid: disputeHash,
        // you must pick from one of the whitelisted tags here:
        // https://docs.story.foundation/concepts/dispute-module/overview#dispute-tags
        targetTag: DisputeTargetTag.IMPROPER_REGISTRATION,
        bond: parseEther('0.1'),
        liveness: 2592000, // 30 days
    })
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`)
}

// example function you can use for testing purposes if you want
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
