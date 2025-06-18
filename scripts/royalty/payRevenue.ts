import { Address, parseEther, zeroAddress } from 'viem'
import { RoyaltyPolicyLRP } from '../../utils/utils'
import { client } from '../../utils/config'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'

// This is Ippy (Story's mascot) on Aeneid testnet. The license terms
// specify 1 $WIP mint fee and a 5% commercial rev share.
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'
// This is a random derivative asset of Ippy for testing.
const CHILD_IP_ID: Address = '0x11eE9193F380c117a7031D8d93FEe0b440DEeFaE'

const main = async function () {
    // 1. Pay Royalty
    //
    // You will be paying for this royalty using $WIP:
    // https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000
    // If you don't have enough $WIP, the function will auto
    // wrap an equivalent amount of $IP into $WIP for you.
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#payroyaltyonbehalf
    const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: CHILD_IP_ID,
        payerIpId: zeroAddress,
        token: WIP_TOKEN_ADDRESS,
        amount: parseEther('2'), // 2 $WIP
    })
    console.log('Paid royalty:', {
        'Transaction Hash': payRoyalty.txHash,
    })

    // 2. Child Claim Revenue
    //
    // Note that claiming revenue is permissionless. Anyone can claim
    // revenue for any asset.
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const childClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: CHILD_IP_ID,
        claimer: CHILD_IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [],
        royaltyPolicies: [],
    })
    console.log('Child claimed revenue:', childClaimRevenue.claimedTokens)

    // 3. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const parentClaimRevenue = await client.royalty.claimAllRevenue({
        ancestorIpId: PARENT_IP_ID,
        claimer: PARENT_IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [CHILD_IP_ID],
        royaltyPolicies: [RoyaltyPolicyLRP],
    })
    console.log('Parent claimed revenue receipt:', parentClaimRevenue.claimedTokens)

    /*

    A couple of notes:

    1. By default, revenue is claimed to the IP Account, not the IP owner's
    wallet. This is because when an IP is created, the royalty tokens for that IP
    (where revenue gets claimed to) are minted to the IP Account.

    2. To transfer from IP Account -> IP Owner's wallet, the owners of the
    PARENT and CHILD IP can run the `transferErc20` function (it will not work
    if you run it for someone else's IP obviously).

    Docs: https://docs.story.foundation/sdk-reference/ipaccount#transfererc20
    const transferFromIpAccount = await client.ipAccount.transferErc20({
        ipId: PARENT_IP_ID,
        tokens: [
            {
                address: WIP_TOKEN_ADDRESS,
                amount: parseEther('1'),
                target: "0x02", // the external wallet
            },
        ],
    })

    3. If the **IP owner** had called `claimAllRevenue` before, our SDK would
    automatically transfer the revenue to the IP owner's wallet for convenience.

    4. If the IP owner wants revenue to always be claimed to their wallet and
    avoid the middle step, they should transfer the royalty tokens from the IP
    account to their wallet. See the `transferRoyaltyTokens.ts` script for an
    example.
    
    */
}

main()
