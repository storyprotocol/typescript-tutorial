import { Address } from 'viem'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import { client } from '../../utils/config'

// TODO: You can change this.
const IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'

const main = async function () {
    // 1. Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const response = await client.royalty.claimAllRevenue({
        ancestorIpId: IP_ID,
        claimer: IP_ID,
        childIpIds: [],
        royaltyPolicies: [],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    })
    console.log('Claimed revenue:', response.claimedTokens)
}

main()
