import { Address } from 'viem'
import { client } from '../../utils/config'

// TODO: Replace with your own IP ID and license terms id
const IP_ID: Address = '0x1aAE062C498d0c3276d845fff2F81F30B78999F0'
const LICENSE_TERMS_ID: string = '95'

const main = async function () {
    // 1. Mint License Tokens
    //
    // Docs: https://docs.story.foundation/sdk-reference/license#mintlicensetokens
    const response = await client.license.mintLicenseTokens({
        licenseTermsId: LICENSE_TERMS_ID,
        licensorIpId: IP_ID,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
        txOptions: { waitForTransaction: true },
    })

    console.log('License minted:', {
        'Transaction Hash': response.txHash,
        'License Token IDs': response.licenseTokenIds,
    })
}

main()
