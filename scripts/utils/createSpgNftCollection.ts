import { zeroAddress } from 'viem'
import { client } from './utils'

const main = async function () {
    // Create a new SPG NFT collection
    //
    // NOTE: Use this code to create a new SPG NFT collection. You can then use the
    // `newCollection.spgNftContract` address as the `spgNftContract` argument in
    // functions like `mintAndRegisterIpAssetWithPilTerms` in the
    // `simpleMintAndRegisterSpg.ts` file.
    //
    // You will mostly only have to do this once. Once you get your nft contract address,
    // you can use it in SPG functions.
    //
    const newCollection = await client.nftClient.createNFTCollection({
        name: 'Test NFTs',
        symbol: 'TEST',
        isPublicMinting: true,
        mintOpen: true,
        mintFeeRecipient: zeroAddress,
        contractURI: '',
        txOptions: { waitForTransaction: true },
    })

    console.log(`New SPG NFT collection created at transaction hash ${newCollection.txHash}`)
    console.log(`NFT contract address: ${newCollection.spgNftContract}`)
}

main()
