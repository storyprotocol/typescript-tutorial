import { http, createWalletClient, createPublicClient } from 'viem'
import { sepolia } from 'viem/chains'
import { NFTContractAddress, RPCProviderUrl, account, mintContractApi } from './utils'

export async function mintNFT(): Promise<string> {
    console.log('Minting a new NFT...')
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(RPCProviderUrl),
    })
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(RPCProviderUrl),
    })

    const { request } = await publicClient.simulateContract({
        address: NFTContractAddress,
        functionName: 'mint',
        args: [account.address],
        abi: [mintContractApi],
    })
    const hash = await walletClient.writeContract(request)
    console.log(`Minted NFT successful with hash: ${hash}`)

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    const tokenId = Number(receipt.logs[0].topics[3]).toString()
    console.log(`Minted NFT tokenId: ${tokenId}`)

    return tokenId
}
