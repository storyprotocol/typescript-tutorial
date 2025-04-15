import { SPGNFTContractAddress, createCommercialRemixTerms } from '../../utils/utils'
import { client, account, publicClient, walletClient } from '../../utils/config'
import { toHex } from 'viem'
import { LicensingConfig } from '@story-protocol/core-sdk'
import { zeroAddress } from 'viem'
import { totalLicenseTokenLimitHook } from '../../utils/abi/totalLicenseTokenLimitHook'

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
                // set the licensing config here
                licensingConfig,
            },
        ],
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
        txOptions: { waitForTransaction: true },
    })
    console.log('Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Term IDs': response.licenseTermsIds,
    })

    // 3. Set Total License Token Limit
    const { request } = await publicClient.simulateContract({
        // address of TotalLicenseTokenLimitHook
        // from https://docs.story.foundation/developers/deployed-smart-contracts
        address: '0xaBAD364Bfa41230272b08f171E0Ca939bD600478',
        abi: totalLicenseTokenLimitHook,
        functionName: 'setTotalLicenseTokenLimit',
        args: [
            response.ipId, // licensorIpId
            '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316', // licenseTemplate
            response.licenseTermsIds![0], // licenseTermsId
            1n, // limit (as BigInt)
        ],
        account: account, // Specify the account to use for permission checking
    })

    // Prepare transaction
    const hash = await walletClient.writeContract({ ...request, account: account })

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({
        hash,
    })

    console.log('Total license token limit set:', {
        Receipt: receipt,
    })
}

main()
