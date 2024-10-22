import {
    PayRoyaltyOnBehalfResponse,
    PIL_TYPE,
    RegisterDerivativeResponse,
    RegisterIpAndAttachPilTermsResponse,
    RegisterIpResponse,
    StoryClient,
    StoryConfig,
    TransferToVaultAndSnapshotAndClaimByTokenBatchResponse,
} from '@story-protocol/core-sdk'
import { Address, http, toHex, zeroAddress } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { CurrencyAddress, NFTContractAddress, RPCProviderUrl, RoyaltyPolicyLAP, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Register Derivative Commercial" example.

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.story.foundation/docs/typescript-sdk-setup
    const config: StoryConfig = {
        account: account,
        transport: http(RPCProviderUrl),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)

    // 2. Register an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const parentTokenId = await mintNFT(account.address, 'test-uri')
    const parentIp: RegisterIpAndAttachPilTermsResponse = await client.ipAsset.registerIpAndAttachPilTerms({
        nftContract: NFTContractAddress,
        tokenId: parentTokenId!,
        pilType: PIL_TYPE.COMMERCIAL_REMIX,
        commercialRevShare: 50, // 50%
        mintingFee: 0,
        currency: CurrencyAddress,
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
        `Root IPA created at transaction hash ${parentIp.txHash}, IPA ID: ${parentIp.ipId}, License Terms ID: ${parentIp.licenseTermsId}`
    )

    // 3. Register another (child) IP Asset
    //
    // Docs: https://docs.story.foundation/docs/register-an-nft-as-an-ip-asset
    const childTokenId = await mintNFT(account.address, 'test-uri')
    const childIp: RegisterIpResponse = await client.ipAsset.register({
        nftContract: NFTContractAddress,
        tokenId: childTokenId!,
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
    console.log(`Derivative IPA created at transaction hash ${childIp.txHash}, IPA ID: ${childIp.ipId}`)

    // 4. Make the Child IP Asset a Derivative of the Parent IP Asset
    //
    // Docs: https://docs.story.foundation/docs/spg-functions#register--derivative
    const linkDerivativeResponse: RegisterDerivativeResponse = await client.ipAsset.registerDerivative({
        childIpId: childIp.ipId as Address,
        parentIpIds: [parentIp.ipId as Address],
        licenseTermsIds: [parentIp.licenseTermsId as bigint],
        txOptions: { waitForTransaction: true },
    })
    console.log(`Derivative linked at transaction hash ${linkDerivativeResponse.txHash}`)

    // 5. Pay Royalty
    // NOTE: You have to approve the RoyaltyModule to spend 2 SUSD on your behalf first. See README for instructions.
    //
    // Docs: https://docs.story.foundation/docs/pay-ipa
    const payRoyalty: PayRoyaltyOnBehalfResponse = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: childIp.ipId as Address,
        payerIpId: zeroAddress,
        token: CurrencyAddress,
        amount: 2,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Paid royalty at transaction hash ${payRoyalty.txHash}`)

    // 6. Claim Revenue
    //
    // Docs: https://docs.story.foundation/docs/claim-revenue
    const claimRevenue: TransferToVaultAndSnapshotAndClaimByTokenBatchResponse =
        await client.royalty.transferToVaultAndSnapshotAndClaimByTokenBatch({
            ancestorIpId: parentIp.ipId as Address,
            claimer: parentIp.ipId as Address,
            royaltyClaimDetails: [
                { childIpId: childIp.ipId as Address, royaltyPolicy: RoyaltyPolicyLAP, currencyToken: CurrencyAddress, amount: 1 },
            ],
            txOptions: { waitForTransaction: true },
        })
    console.log(`Claimed revenue: ${claimRevenue.amountsClaimed} at snapshotId ${claimRevenue.snapshotId}`)
}

main()
