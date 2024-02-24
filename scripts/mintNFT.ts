import { http, Address, createWalletClient, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export async function mintNFT(): Promise<string> {
    console.log('Minting a new NFT...')
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Address)
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    })
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
    })
    const contractAbi = {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'mint',
        outputs: [
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    }

    // 3. Mint an NFT to your account
    const { result } = await publicClient.simulateContract({
        address: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
        functionName: 'mint',
        args: [account.address],
        abi: [contractAbi]
    })
    const hash = await walletClient.writeContract({
        address: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
        functionName: 'mint',
        args: [account.address],
        abi: [contractAbi]
    })

    let tokenId = result!.toString();

    console.log(`Minted NFT successful with hash: ${hash}`);
    console.log(`Minted NFT tokenId: ${tokenId}`);

    return tokenId;
}