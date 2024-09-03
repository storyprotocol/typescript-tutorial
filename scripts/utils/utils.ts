import { defineChain } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'

// Add your private key to your .env file.
const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
export const account: Account = privateKeyToAccount(privateKey)

// This is a pre-configured PIL Flavor: https://docs.storyprotocol.xyz/docs/pil-flavors
export const NonCommercialSocialRemixingTermsId = '1'

// A NFT contract address that will be used to represent your IP Assets
export const NFTContractAddress: Address = (process.env.NFT_CONTRACT_ADDRESS as Address) || '0x322813fd9a801c5507c9de605d63cea4f2ce6c44'

// Add your rpc provider url to your .env file
// You can select from one of these: https://docs.story.foundation/docs/story-network#-rpcs
export const RPCProviderUrl = process.env.RPC_PROVIDER_URL || 'https://testnet.storyrpc.io'

// Mock token contract for paying License Token
export const CurrencyAddress: Address = (process.env.CURRENCY_ADDRESS as Address) || '0x91f6F05B08c16769d3c85867548615d270C42fC7'

export const mintContractApi = {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
}

export const iliad = defineChain({
    id: 15_13,
    name: 'iliad',
    nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://testnet.storyrpc.io'],
            webSocket: ['wss://story-network.rpc.caldera.xyz/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://testnet.storyscan.xyz',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 5882,
        },
    },
    testnet: true,
})
