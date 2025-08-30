import { defaultLicensingConfig, RoyaltyPolicyLAP, SPGNFTContractAddress } from '../../utils/utils'
import { account, client, networkInfo, walletClient } from '../../utils/config'
import { uploadJSONToIPFS } from '../../utils/functions/uploadToIpfs'
import { createHash } from 'crypto'
import { IpMetadata, PILFlavor, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import { encodeFunctionData } from 'viem'
import { licenseAttachmentWorkflowsAbi } from '../../utils/abi/licenseAttachmentWorkflowsAbi'

const main = async function () {
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: 'Midnight Marriage',
        description: 'This is a house-style song generated on suno.',
        createdAt: '1740005219',
        creators: [
            {
                name: 'Jacob Tucker',
                address: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
                contributionPercent: 100,
            },
        ],
        image: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
        imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
        mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
        mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
        mediaType: 'audio/mpeg',
    })

    const nftMetadata = {
        name: 'Midnight Marriage',
        description: 'This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.',
        image: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
        animation_url: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
        attributes: [
            {
                key: 'Suno Artist',
                value: 'amazedneurofunk956',
            },
            {
                key: 'Artist ID',
                value: '4123743b-8ba6-4028-a965-75b79a3ad424',
            },
            {
                key: 'Source',
                value: 'Suno.com',
            },
        ],
    }

    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    const transactionRequest = {
        to: '0xcC2E862bCee5B6036Db0de6E06Ae87e524a79fd8' as `0x${string}`, // LicenseAttachmentWorkflows: https://docs.story.foundation/developers/deployed-smart-contracts
        data: encodeFunctionData({
            abi: licenseAttachmentWorkflowsAbi, // abi from another file
            functionName: 'mintAndRegisterIpAndAttachPILTerms',
            args: [
                SPGNFTContractAddress,
                account.address,
                {
                    ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                    ipMetadataHash: `0x${ipHash}`,
                    nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
                    nftMetadataHash: `0x${nftHash}`,
                },
                [
                    {
                        terms: PILFlavor.commercialRemix({
                            commercialRevShare: 0,
                            defaultMintingFee: 0,
                            currency: WIP_TOKEN_ADDRESS,
                        }),
                        licensingConfig: defaultLicensingConfig,
                    },
                ],
                true,
            ],
        }),
    }

    try {
        const txHash = await walletClient.sendTransaction({
            ...transactionRequest,
            account,
            chain: networkInfo.chain,
        })

        console.log(`Transaction sent: ${networkInfo.blockExplorer}/tx/${txHash}`)
    } catch (error) {
        console.error(error)
    }
}

main()
