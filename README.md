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
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=<your_pinata_jwt>
    ```

3. `npm run mint-and-register`

## 📄 Run "Simple Mint and Register SPG" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=<your_pinata_jwt>
    ```

3. [OPTIONAL] We have already configured a public SPG NFT collection for you (`0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc`). If you want to create your own collection for your IPs, create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=<your_spg_nft_contract_address>
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

4. `npm run mint-and-register-spg`

## 🖼️ Run "Register Derivative Non-Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. `npm run register-deriv-non-com`

## 💰 Run "Register Derivative Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. You will be paying for the License Token using [$WIP](https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000). Make sure you have enough $WIP in your wallet before running the script.

    **NOTE: If you don't have enough $WIP, the function will auto wrap an equivalent amount of $IP into $WIP for you.**

3. `npm run register-deriv-com`

## ⚡ Run "Register Derivative Commercial SPG" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. You will be paying for the License Token using [$WIP](https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000). Make sure you have enough $WIP in your wallet before running the script.

    **NOTE: If you don't have enough $WIP, the function will auto wrap an equivalent amount of $IP into $WIP for you.**

3. [OPTIONAL] We have already configured a public SPG NFT collection for you (`0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc`). If you want to create your own collection for your IPs, create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=<your_spg_nft_contract_address>
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

4. `npm run register-deriv-com-spg`

## ❌ Run "Dispute IP" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

2. You must get your own unique CID to be used as dispute evidence (the `cid` parameter in the script). This is because the protocol does not allow you to use the same CID twice for dispute.

3. `npm run dispute-ip`
