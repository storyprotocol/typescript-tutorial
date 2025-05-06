# Story TypeScript SDK Examples

## Get Started

1. Install the dependencies:

    ```
    npm install
    ```

2. Rename the `.env.example` file to `.env`

3. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=<your_wallet_private_key>
    ```

4. [REQUIRED FOR `register` and `register-custom` SCRIPTS] Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=<your_pinata_jwt>
    ```

5. [OPTIONAL] We have already configured a public SPG NFT collection for you (`0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc`). If you want to create your own collection for your IPs, create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=<your_spg_nft_contract_address>
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

## Available Scripts

Below are all of the available scripts to help you build on Story.

### Registration

-   `register`: This mints an NFT and registers it in the same transaction, using a public SPG collection.
-   `register-custom`: This mints an NFT using a custom ERC-721 contract and then registers it in a separate transaction.

### Licenses

-   `mint-license`: Mints a license token from an IP Asset.
-   `limit-license`: Registers a new IP and attaches license terms that only allow you to mint 1 license token. This is an example for limiting the amount of licenses you can mint.

### Royalty

-   `pay-revenue`: This is an example of registering a derivative, paying the derivative, and then allowing derivative and parent to claim their revenues.
-   `license-revenue`: This is an example of registering a derivative, minting a paid license from the derivative, and then allowing derivative and parent to claim their revenues.
-   `transfer-royalty-tokens`: This shows you how to transfer Royalty Tokens from an IP Account to any external wallet. Royalty Tokens are used to claim a % of revenue from an IP Asset.

### Derivative

-   `derivative-commercial`: This mints an NFT and registers it as a derivative of an IP Asset in the same transaction, using a public SPG collection. It costs 1 $WIP to register as derivative and also includes an example of the parent claiming its revenue.
-   `derivative-non-commercial`: This mints an NFT and registesr it as a derivative of an IP Asset in the same transaction, using a public SPG collection. It's free to register as derivative.
-   `derivative-commercial-custom`: This mints an NFT using a custom ERC-721 contract and then registers it as a derivative of an IP Asset in a separate transaction. It costs 1 $WIP to register as derivative and also includes an example of the parent claiming its revenue.

### Dispute

-   `dispute`: This disputes an IP Asset.

### Misc

-   `send-raw-transaction`: An example of sending a transaction using viem's `encodeFunctionData`.
