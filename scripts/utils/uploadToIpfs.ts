const pinataSDK = require('@pinata/sdk')
const fs = require('fs')
const path = require('path')

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const { IpfsHash } = await pinata.pinJSONToIPFS(jsonMetadata)
    return IpfsHash
}

// could use this to upload music (audio files) to IPFS
export async function uploadFileToIPFS(filePath: string): Promise<string> {
    // Create a readable stream for the file
    const readableStreamForFile = fs.createReadStream(path.join(__dirname, filePath))
    const options = {
        pinataMetadata: {
            name: 'Audio File',
        },
    }

    // Upload the file to Pinata
    const { IpfsHash } = await pinata.pinFileToIPFS(readableStreamForFile, options)

    return IpfsHash
}
