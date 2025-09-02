import { aeneid, getSignature, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, createWalletClient, encodeFunctionData, http, WalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import { licensingModuleAbi } from '../../utils/abi/licensingModuleAbi'

dotenv.config()

// This is a niche example showing how a user can pay (the tx cost + minting fee) to mint a PRIVATE license for a given IP Asset. They are able to do this because the IP owner signs the message, but the user runs the transaction with the signature.

const IP_ID: Address = '0x656A767D7F32e2FA6BfB745ba21dD251bBc6E660'

const main = async function () {
    // ip owner wallet
    const walletClient = createWalletClient({
        chain: aeneid,
        transport: http('https://aeneid.storyrpc.io'),
        account: privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY_IP_OWNER}` as Address),
    }) as WalletClient

    // user wallet
    const userAccount = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY_USER}` as Address)
    const config: StoryConfig = {
        account: userAccount,
        transport: http('https://aeneid.storyrpc.io'),
        chainId: aeneid.id,
    }
    const client = StoryClient.newClient(config)

    const data = encodeFunctionData({
        abi: licensingModuleAbi, // abi from another file
        functionName: 'mintLicenseTokens',
        args: [
            IP_ID, // ipId
            '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316', // pil license template
            1n, // license terms id
            1n, // amount
            userAccount.address, // receiver (can be whoever you want to receive the license)
            '0x', // royalty contract (can leave as '0x')
            0n, // max minting fee (default)
            100_000_000, // max revenue share (default)
        ],
    })

    const VALID_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now
    const nonceResult = await client.ipAccount.getIpAccountNonce(IP_ID)

    const { signature } = await getSignature({
        state: nonceResult,
        to: '0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f', // licensing module
        encodeData: data,
        wallet: walletClient,
        verifyingContract: IP_ID, // ipId
        deadline: VALID_DEADLINE,
        chainId: aeneid.id,
    })

    try {
        const response = await client.ipAccount.executeWithSig({
            to: '0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f', // licensing module
            data: data,
            ipId: IP_ID,
            signer: walletClient.account?.address as Address, // ip owner
            deadline: VALID_DEADLINE,
            signature: signature,
        })

        console.log(`Transaction sent: https://aeneid.storyscan.io/tx/${response.txHash}`)
    } catch (error) {
        console.error(error)
    }
}

main()
