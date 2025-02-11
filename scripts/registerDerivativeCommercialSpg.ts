import { Address, toHex, zeroAddress } from 'viem'
import { RoyaltyPolicyLAP, SPGNFTContractAddress, createCommercialRemixTerms, client, defaultLicensingConfig } from './utils/utils'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Register Derivative Commercial SPG" example.

const main = async function () {
    // 1. Mint and Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/sdk-ipasset#mintandregisteripassetwithpilterms
    const parentIp = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        allowDuplicates: true,
        licenseTermsData: [
            {
                terms: createCommercialRemixTerms({ commercialRevShare: 50, defaultMintingFee: 0 }),
                licensingConfig: defaultLicensingConfig,
            },
        ],
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
    console.log(
        `Root IPA created at transaction hash ${parentIp.txHash}, IPA ID: ${parentIp.ipId}, License Terms ID: ${parentIp.licenseTermsIds}`
    )

    // 2. Mint and Register IP asset and make it a derivative of the parent IP Asset
    //
    // Docs: https://docs.story.foundation/docs/sdk-ipasset#mintandregisteripandmakederivative
    const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: SPGNFTContractAddress,
        allowDuplicates: true,
        derivData: {
            parentIpIds: [parentIp.ipId as Address],
            licenseTermsIds: parentIp.licenseTermsIds as bigint[],
            maxMintingFee: 0,
            maxRts: 100_000_000,
            maxRevenueShare: 100,
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
    console.log(`Derivative IPA created and linked at transaction hash ${childIp.txHash}, IPA ID: ${childIp.ipId}}`)

    // 3. Pay Royalty
    //
    // Docs: https://docs.story.foundation/docs/sdk-royalty#payroyaltyonbehalf
    const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: childIp.ipId as Address,
        payerIpId: zeroAddress,
        token: WIP_TOKEN_ADDRESS,
        amount: 2,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Paid royalty at transaction hash ${payRoyalty.txHash}`)

    // 4. Child Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/sdk-royalty#claimallrevenue
    const childClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: childIp.ipId as Address,
        claimer: childIp.ipId as Address,
        childIpIds: [],
        royaltyPolicies: [],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    })
    console.log('Child claimed revenue:')
    console.dir(childClaimRevenue.claimedTokens)

    // 5. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/sdk-royalty#claimallrevenue
    const parentClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: parentIp.ipId as Address,
        claimer: parentIp.ipId as Address,
        childIpIds: [childIp.ipId as Address],
        royaltyPolicies: [RoyaltyPolicyLAP],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    })
    console.log('Parent claimed revenue:')
    console.dir(parentClaimRevenue.claimedTokens)
}

main()
