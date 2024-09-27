import { http, createWalletClient, createPublicClient, Address } from 'viem'
import { NFTContractAddress, RPCProviderUrl, account } from './utils'
import { iliad } from '@story-protocol/core-sdk'

const baseConfig = {
    chain: iliad,
    transport: http(RPCProviderUrl),
} as const
export const publicClient = createPublicClient(baseConfig)
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
})

export async function mintNFT(): Promise<number | undefined> {
    console.log('Minting a new NFT...')

    const { request } = await publicClient.simulateContract({
        abi: [
            {
                inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
                name: 'mint',
                outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        address: NFTContractAddress,
        functionName: 'mint',
        args: [account.address as Address],
    })
    const hash = await walletClient.writeContract(request)
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16)
    }
}
