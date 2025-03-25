import { Address, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, account, client } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions
// for running this "Register Derivative Non-Commercial" example.

// TODO: This is Ippy on Aeneid. You can change these.
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'

const main = async function () {
    // Register a Derivative IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#registerderivativeip
    const childTokenId = await mintNFT(account.address, 'test-uri')
    const childIp = await client.ipAsset.registerDerivativeIp({
        nftContract: NFTContractAddress,
        tokenId: childTokenId!,
        derivData: {
            parentIpIds: [PARENT_IP_ID],
            licenseTermsIds: [NonCommercialSocialRemixingTermsId],
        },
        // NOTE: The below metadata is not configured properly. It is just to make things simple.
        // See `simpleMintAndRegister.ts` for a proper example.
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log('Derivative IPA created:', {
        'Transaction Hash': childIp.txHash,
        'IPA ID': childIp.ipId,
    })
}

main()
