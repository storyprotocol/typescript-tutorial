import { Address } from 'viem'
import { convertRoyaltyPercentToTokens, RoyaltyPolicyLAP, SPGNFTContractAddress } from '../../utils/utils'
import { account, client } from '../../utils/config'
import { PILFlavor, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'

const main = async function () {
    // FOR SETUP: Create a new IP Asset we can use
    const parentIp = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: PILFlavor.commercialRemix({
                    commercialRevShare: 0,
                    defaultMintingFee: 0,
                    currency: WIP_TOKEN_ADDRESS,
                }),
            },
        ],
    })
    console.log('Parent IPA created:', {
        'Transaction Hash': parentIp.txHash,
        'IPA ID': parentIp.ipId,
        'License Terms ID': parentIp.licenseTermsIds?.[0],
    })

    // FOR SETUP: Mint a license token in order to trigger IP Royalty Vault deployment
    const mintLicense = await client.license.mintLicenseTokens({
        licenseTermsId: parentIp.licenseTermsIds?.[0]!,
        licensorIpId: parentIp.ipId as Address,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
    })
    console.log('Minted license:', {
        'Transaction Hash': mintLicense.txHash,
        'License Token ID': mintLicense.licenseTokenIds?.[0],
    })

    // Get the IP Royalty Vault Address
    // Note: This is equivalent to the currency address of the ERC-20
    // Royalty Tokens.
    const royaltyVaultAddress = await client.royalty.getRoyaltyVaultAddress(parentIp.ipId as Address)
    console.log('Royalty Vault Address:', royaltyVaultAddress)

    // Transfer the Royalty Tokens from the IP Account to the address
    // executing this transaction (you could use any other address as well)
    const transferRoyaltyTokens = await client.ipAccount.transferErc20({
        ipId: parentIp.ipId as Address,
        tokens: [
            {
                address: royaltyVaultAddress,
                amount: convertRoyaltyPercentToTokens(1),
                target: account.address,
            },
        ],
    })
    console.log('Transferred royalty tokens:', { 'Transaction Hash': transferRoyaltyTokens.txHash })
}

main()
