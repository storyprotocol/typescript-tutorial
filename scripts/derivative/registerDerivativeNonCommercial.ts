import { Address, toHex } from 'viem'
import { SPGNFTContractAddress, NonCommercialSocialRemixingTermsId } from '../../utils/utils'
import { client } from '../../utils/config'

// TODO: You can change this
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'

const main = async function () {
    // 1. Mint and Register IP asset and make it a derivative of the parent IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#mintandregisteripandmakederivative
    const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: SPGNFTContractAddress,
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
    console.log('Derivative IPA created and linked:', {
        'Transaction Hash': childIp.txHash,
        'IPA ID': childIp.ipId,
    })
}

main()
