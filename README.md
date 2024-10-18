# Story Protocol TypeScript SDK Examples

### Get Started

1. Install the dependencies:

    ```
    npm install
    ```

2. Rename the `.env.example` file to `.env`

3. Read the docs below associated with the example you want to run

## 📄 Run "Simple Mint and Register" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=<YOUR_PINATA_JWT>
    ```

3. `npm run mint-and-register`

## 📄 Run "Simple Mint and Register SPG" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=<YOUR_PINATA_JWT>
    ```

3. Create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=<SPG_NFT_CONTRACT_ADDRESS>
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

4. `npm run mint-and-register-spg`

## 🖼️ Run "Register Derivative Non-Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
    ```

2. `npm run register-deriv-non-com`

## 💰 Run "Register Derivative Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
    ```

2. You will be paying for the License Token using a [test ERC-20 token](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7).

    2a. Mint some tokens by running [this](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7?tab=write_contract#40c10f19) transaction (10 is good).

    2b. Next, you have to allow the royalty contract to spend those tokens on your behalf to mint the License Token. Run the [approve transaction](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7?tab=write_contract#095ea7b3) where the `spender` is the v1.1 (current deployment supported by the SDK) address of `RoyaltyPolicyLAP` [here](https://docs.story.foundation/docs/deployed-smart-contracts). And the value is >= 1 (that's the minting fee used in the script).

3. `npm run register-deriv-com`
