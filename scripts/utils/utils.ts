import { LicenseTerms, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, zeroAddress } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import dotenv from 'dotenv'
dotenv.config()

// Add your rpc provider url to your .env file
// You can select from one of these: https://docs.story.foundation/docs/story-network#-rpcs
export const RPCProviderUrl = process.env.RPC_PROVIDER_URL || 'https://rpc.odyssey.storyrpc.io'

// Add your private key to your .env file.
const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
export const account: Account = privateKeyToAccount(privateKey)
const config: StoryConfig = {
    account: account,
    transport: http(RPCProviderUrl),
    chainId: 'odyssey',
}
export const client = StoryClient.newClient(config)

// This is a pre-configured PIL Flavor: https://docs.story.foundation/docs/pil-flavors
export const NonCommercialSocialRemixingTermsId = '1'

// A NFT contract address that will be used to represent your IP Assets
export const NFTContractAddress: Address = (process.env.NFT_CONTRACT_ADDRESS as Address) || '0x041B4F29183317Fd352AE57e331154b73F8a1D73'
export const SPGNFTContractAddress: Address = process.env.SPG_NFT_CONTRACT_ADDRESS as Address

// The currency used for paying License Tokens or tipping
// This address must be whitelisted by the protocol. You can see the
// currently whitelisted addresses here: https://docs.story.foundation/docs/royalty-module#whitelisted-revenue-tokens
export const SUSDAddress: Address = '0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5'

// Docs: https://docs.story.foundation/docs/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = '0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6'

export function createCommercialRemixTerms(terms: { commercialRevShare: number; defaultMintingFee: number }): LicenseTerms {
    return {
        transferable: true,
        royaltyPolicy: RoyaltyPolicyLAP,
        defaultMintingFee: BigInt(terms.defaultMintingFee),
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: zeroAddress,
        commercialRevShare: terms.commercialRevShare,
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: SUSDAddress,
        uri: '',
    }
}
