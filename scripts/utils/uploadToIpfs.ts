import { IpMetadata } from '@story-protocol/core-sdk'

const pinataSDK = require('@pinata/sdk')

export async function uploadJSONToIPFS(ipMetadata: IpMetadata): Promise<string> {
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })
    const { IpfsHash } = await pinata.pinJSONToIPFS(ipMetadata)
    return IpfsHash
}
