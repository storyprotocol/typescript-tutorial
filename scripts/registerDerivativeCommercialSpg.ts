import { Address, toHex, zeroAddress } from 'viem'
import { SUSDAddress, RoyaltyPolicyLAP, SPGNFTContractAddress, createCommercialRemixTerms, client } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Register Derivative Commercial SPG" example.

const main = async function () {
    // 1. Mint and Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const parentIp = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        terms: [createCommercialRemixTerms({ commercialRevShare: 50, defaultMintingFee: 0 })],
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
    // Docs: https://docs.story.foundation/docs/register-a-derivative#/mint-nft-register-ip-and-link-to-existing-parent-ip
    const { txHash, childIpId } = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: SPGNFTContractAddress,
        derivData: {
            parentIpIds: [parentIp.ipId as Address],
            licenseTermsIds: parentIp.licenseTermsIds as bigint[],
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
    console.log(`Derivative IPA created and linked at transaction hash ${txHash}, IPA ID: ${childIpId}}`)

    // 3. Pay Royalty
    // NOTE: You have to approve the RoyaltyModule to spend 2 SUSD on your behalf first. See README for instructions.
    //
    // Docs: https://docs.story.foundation/docs/pay-ipa
    const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: childIpId as Address,
        payerIpId: zeroAddress,
        token: SUSDAddress,
        amount: 2,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Paid royalty at transaction hash ${payRoyalty.txHash}`)

    // 4. Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/claim-revenue
    const claimRevenue = await client.royalty.transferToVaultAndSnapshotAndClaimByTokenBatch({
        ancestorIpId: parentIp.ipId as Address,
        claimer: parentIp.ipId as Address,
        royaltyClaimDetails: [
            {
                childIpId: childIpId as Address,
                royaltyPolicy: RoyaltyPolicyLAP,
                currencyToken: SUSDAddress,
                amount: 1,
            },
        ],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Claimed revenue: ${claimRevenue.amountsClaimed} at snapshotId ${claimRevenue.snapshotId}`)
}

main()
