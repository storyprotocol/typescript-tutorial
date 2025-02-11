import { http, createWalletClient, createPublicClient, Address, WalletClient } from 'viem'
import { NFTContractAddress, RPCProviderUrl, account } from './utils'
import { aeneid } from '@story-protocol/core-sdk'
import { defaultNftContractAbi } from './defaultNftContractAbi'

const baseConfig = {
    chain: aeneid,
    transport: http(RPCProviderUrl),
} as const
export const publicClient = createPublicClient(baseConfig)
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
}) as WalletClient

export async function mintNFT(to: Address, uri: string): Promise<number | undefined> {
    console.log('Minting a new NFT...')

    const { request } = await publicClient.simulateContract({
        address: NFTContractAddress,
        functionName: 'mintNFT',
        args: [to, uri],
        abi: defaultNftContractAbi,
    })
    const hash = await walletClient.writeContract({ ...request, account: account })
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16)
    }
}
