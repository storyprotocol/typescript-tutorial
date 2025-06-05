import axios from 'axios'
import FormData from 'form-data'

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            'Content-Type': 'application/json',
        },
        data: {
            pinataOptions: { cidVersion: 0 },
            pinataMetadata: { name: 'ip-metadata.json' },
            pinataContent: jsonMetadata,
        },
    }

    try {
        const response = await axios(url, options)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error)
        throw error
    }
}

export async function uploadTextToIPFS(text: string): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    const data = new FormData()
    const buffer = Buffer.from(text, 'utf-8')
    data.append('file', buffer, { filename: 'dispute-evidence.txt', contentType: 'text/plain' })

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            ...data.getHeaders(),
        },
        data: data,
    }

    try {
        const response = await axios(url, options)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading text to IPFS:', error)
        throw error
    }
}
