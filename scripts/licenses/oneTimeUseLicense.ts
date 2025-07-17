import { SPGNFTContractAddress, createCommercialRemixTerms } from '../../utils/utils'
import { client } from '../../utils/config'
import { toHex } from 'viem'
import { LicensingConfig } from '@story-protocol/core-sdk'
import { zeroAddress } from 'viem'

const LICENSE_LIMIT = 1

const main = async function () {
    // 1. Set up Licensing Config
    //
    // Docs: https://docs.story.foundation/concepts/licensing-module/license-config-hook#license-config
    const licensingConfig: LicensingConfig = {
        isSet: true,
        mintingFee: 0n,
        // address of TotalLicenseTokenLimitHook
        // from https://docs.story.foundation/developers/deployed-smart-contracts
        licensingHook: '0xaBAD364Bfa41230272b08f171E0Ca939bD600478',
        hookData: zeroAddress,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: zeroAddress,
    }

    // 2. Mint and register IP with the licensing config
    //
    // Docs: https://docs.story.foundation/sdk-reference/ipasset#mintandregisteripassetwithpilterms
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: createCommercialRemixTerms({ commercialRevShare: 0, defaultMintingFee: 0 }),
                licensingConfig,
                // set the license limit here
                maxLicenseTokens: LICENSE_LIMIT,
            },
        ],
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
    })
    console.log('Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Term IDs': response.licenseTermsIds,
        'License Limit': LICENSE_LIMIT,
    })
}

main()
