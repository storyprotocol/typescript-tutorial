import { Address, parseEther, formatEther, encodeFunctionData, toHex, createWalletClient, http } from 'viem'
import { account, client } from '../../utils/config'
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import axios from 'axios'
import { sepolia } from 'viem/chains'

// Constants
const DEBRIDGE_API_URL = 'https://dln.debridge.finance/v1.0/order'
const ETH_MAINNET_CHAIN_ID = 1 // Ethereum Mainnet
const STORY_CHAIN_ID = 11155111 // Story Protocol Chain ID (using Sepolia testnet for example)
const ETH_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Native ETH token address

// Define the RoyaltyModule contract address
// In a real implementation, you would get this from the client's configuration
const ROYALTY_MODULE_ADDRESS: Address = '0x8B7A9d11AAfBDc4Db06D1994eF82aDDBc10D68f4' // Example address

// Configuration
const RECEIVER_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5' // IP that will receive the royalty
const PAYER_IP_ID: Address = '0x0000000000000000000000000000000000000000' // Zero address for external payer
const ROYALTY_AMOUNT_WIP = '2' // Amount in WIP tokens to pay as royalty
const ETH_AMOUNT_TO_BRIDGE = '0.01' // Amount in ETH to bridge (will be converted to WIP)

/**
 * Creates a cross-chain royalty payment transaction using deBridge
 * This allows paying royalties from Ethereum mainnet to Story Protocol
 */
const createCrossChainRoyaltyPayment = async () => {
    try {
        console.log('Creating cross-chain royalty payment transaction...')

        // Step 1: Prepare the payRoyaltyOnBehalf function call data
        // This is the function that will be called on the destination chain (Story Protocol)
        // Using viem's encodeFunctionData to create the call data
        const payRoyaltyCallData = encodeFunctionData({
            abi: [
                {
                    name: 'payRoyaltyOnBehalf',
                    type: 'function',
                    inputs: [
                        { name: 'receiverIpId', type: 'address' },
                        { name: 'payerIpId', type: 'address' },
                        { name: 'token', type: 'address' },
                        { name: 'amount', type: 'uint256' },
                    ],
                    outputs: [],
                    stateMutability: 'nonpayable',
                },
            ],
            functionName: 'payRoyaltyOnBehalf',
            args: [
                RECEIVER_IP_ID,
                PAYER_IP_ID,
                WIP_TOKEN_ADDRESS,
                parseEther(ROYALTY_AMOUNT_WIP), // Using BigInt as required for Solidity uint256
            ],
        })

        console.log('Generated payRoyaltyOnBehalf call data')

        // Step 2: Create the deBridge hook (externalCall) payload
        // This specifies the contract and function to call after bridging the tokens
        const dlnHook = {
            target: ROYALTY_MODULE_ADDRESS,
            callData: payRoyaltyCallData,
            nativeValue: '0', // No additional native value needed for the call
        }

        console.log('Creating transaction with deBridge API...')

        // Step 3: Call the deBridge API to create the transaction
        const response = await axios.post(DEBRIDGE_API_URL, {
            srcChainId: ETH_MAINNET_CHAIN_ID,
            srcChainTokenIn: ETH_TOKEN_ADDRESS, // ETH on Ethereum
            srcChainTokenInAmount: parseEther(ETH_AMOUNT_TO_BRIDGE).toString(),
            dstChainId: STORY_CHAIN_ID,
            dstChainTokenOut: WIP_TOKEN_ADDRESS, // WIP token on Story Protocol
            dstChainTokenOutRecipient: ROYALTY_MODULE_ADDRESS, // Send directly to RoyaltyModule
            dstChainFallbackAddress: account.address, // Fallback address in case the transaction fails
            dlnHook: dlnHook, // The hook to execute payRoyaltyOnBehalf
            affiliateFee: '0', // No affiliate fee
            affiliateAddress: '0x0000000000000000000000000000000000000000', // No affiliate
        })

        console.log('deBridge API response:', response.data)

        // Step 4: Extract the transaction data from the response
        const txData = response.data.tx

        console.log('Transaction data for execution:')
        console.log('To:', txData.to)
        console.log('Value:', formatEther(txData.value), 'ETH')
        console.log('Data:', txData.data)

        // Step 5: Instructions for executing the transaction
        console.log('\nTo execute this transaction:')
        console.log('1. Send a transaction with the following parameters:')
        console.log('   - To:', txData.to)
        console.log('   - Value:', formatEther(txData.value), 'ETH')
        console.log('   - Data: [The data field above]')
        console.log('2. This will bridge your ETH to WIP on Story Protocol and automatically call payRoyaltyOnBehalf')

        return txData
    } catch (error) {
        console.error('Error creating cross-chain royalty payment:', error)
        throw error
    }
}

/**
 * Executes the cross-chain royalty payment transaction
 * This would typically be done by the user's wallet
 */
const executeCrossChainRoyaltyPayment = async (txData: any) => {
    try {
        console.log('Executing cross-chain royalty payment transaction...')

        // Execute the transaction using viem's wallet client directly
        // This bypasses the Story Protocol SDK for this specific cross-chain transaction
        const walletClient = createWalletClient({
            account,
            chain: sepolia, // Using Sepolia as an example - adjust based on the actual chain
            transport: http(),
        })

        const txHash = await walletClient.sendTransaction({
            to: txData.to as Address,
            value: BigInt(txData.value),
            data: txData.data as `0x${string}`,
        })

        console.log('Transaction executed successfully!')
        console.log('Transaction hash:', txHash)

        return txHash
    } catch (error) {
        console.error('Error executing cross-chain royalty payment:', error)
        throw error
    }
}

const main = async function () {
    try {
        // Step 1: Create the cross-chain royalty payment transaction
        console.log('=== Creating Cross-Chain Royalty Payment ===')
        const txData = await createCrossChainRoyaltyPayment()

        // Step 2: Execute the transaction (uncomment to execute)
        console.log('\n=== Executing Cross-Chain Royalty Payment ===')
        const txHash = await executeCrossChainRoyaltyPayment(txData)

        console.log('\nCross-chain royalty payment process completed!')
        console.log('Transaction hash:', txHash)
    } catch (error) {
        console.error('Error in main function:', error)
    }
}

// Run the main function
main()
