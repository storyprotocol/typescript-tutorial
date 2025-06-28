import { Address } from 'viem'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import { client } from '../../utils/config'

// TODO: You can change this. This is Ippy on Aeneid testnet.
const IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'

const main = async function () {
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimrevenue
    const claim = await client.royalty.claimAllRevenue({
        ancestorIpId: IP_ID,
        claimer: IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [],
        royaltyPolicies: [],
    })
    console.log('Claimed revenue:', claim.claimedTokens)
}

main()
