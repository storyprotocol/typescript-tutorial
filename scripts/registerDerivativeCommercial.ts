import { Address, toHex, zeroAddress, parseEther } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, RoyaltyPolicyLAP, RoyaltyPolicyLRP, account, client } from './utils/utils'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains
// instructions for running this "Register Derivative Commercial" example.

// TODO: This is Ippy on Aeneid. The license terms specify 1 $WIP mint fee
// and a 5% commercial rev share. You can change these.
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'
const PARENT_LICENSE_TERMS_ID: string = '96'

const main = async function () {
    // 1. Register another (child) IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#registerderivativeip
    const childTokenId = await mintNFT(account.address, 'test-uri')
    const childIp = await client.ipAsset.registerDerivativeIp({
        nftContract: NFTContractAddress,
        tokenId: childTokenId!,
        derivData: {
            parentIpIds: [PARENT_IP_ID],
            licenseTermsIds: [PARENT_LICENSE_TERMS_ID],
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

    // 2. Pay Royalty
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#payroyaltyonbehalf
    const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: childIp.ipId as Address,
        payerIpId: zeroAddress,
        token: WIP_TOKEN_ADDRESS,
        amount: parseEther('2'), // 2 $WIP
        txOptions: { waitForTransaction: true },
    })
    console.log('Paid royalty:', {
        'Transaction Hash': payRoyalty.txHash,
    })

    // 3. Child Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const childClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: childIp.ipId as Address,
        claimer: childIp.ipId as Address,
        childIpIds: [],
        royaltyPolicies: [],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    })
    console.log('Child claimed revenue:', childClaimRevenue.claimedTokens)

    // 4. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const parentClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: PARENT_IP_ID,
        claimer: PARENT_IP_ID,
        childIpIds: [childIp.ipId as Address],
        royaltyPolicies: [RoyaltyPolicyLRP],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    })
    console.log('Parent claimed revenue:', parentClaimRevenue)
}

main()
