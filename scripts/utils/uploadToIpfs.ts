import { PinataSDK } from 'pinata-web3'

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
})

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const { IpfsHash } = await pinata.upload.json(jsonMetadata)
    return IpfsHash
}

// could use this to upload music (audio files) to IPFS
export async function uploadBlobToIPFS(blob: Blob, fileName: string): Promise<string> {
    const file = new File([blob], fileName, { type: 'image/png' })
    const { IpfsHash } = await pinata.upload.file(file)
    return IpfsHash
}
