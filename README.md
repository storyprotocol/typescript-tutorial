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
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=YOUR_PINATA_JWT
    ```

3. `npm run mint-and-register`

## 📄 Run "Simple Mint and Register SPG" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. Go to [Pinata](https://pinata.cloud/) and create a new API key. Add the JWT to your `.env` file:

    ```
    PINATA_JWT=YOUR_PINATA_JWT
    ```

3. Create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=SPG_NFT_CONTRACT_ADDRESS
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

4. `npm run mint-and-register-spg`

## 🖼️ Run "Register Derivative Non-Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. `npm run register-deriv-non-com`

## 💰 Run "Register Derivative Commercial" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. You will be paying for the License Token using a [test ERC-20 token](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5).

    2a. Mint some tokens by running [this](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5?tab=write_contract#0x40c10f19) transaction (10 is good).

    2b. Next, you have to allow the `RoyaltyModule` to spend those tokens on your behalf so it can properly distribute royalties to ancestor IPs. Run the [approve transaction](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5?tab=write_contract#0x095ea7b3) where the `spender` is `0xEa6eD700b11DfF703665CCAF55887ca56134Ae3B` (this is the Odyssey v1.2 address of `RoyaltyModule` found [here](https://docs.story.foundation/docs/deployed-smart-contracts)) and the value is >= 2 (that's the amount we're paying in the script).

3. `npm run register-deriv-com`

## ⚡ Run "Register Derivative Commercial SPG" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. You will be paying for the License Token using a [test ERC-20 token](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5).

    2a. Mint some tokens by running [this](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5?tab=write_contract#0x40c10f19) transaction (10 is good).

    2b. Next, you have to allow the `RoyaltyModule` to spend those tokens on your behalf so it can properly distribute royalties to ancestor IPs. Run the [approve transaction](https://odyssey.storyscan.xyz/address/0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5?tab=write_contract#0x095ea7b3) where the `spender` is `0xEa6eD700b11DfF703665CCAF55887ca56134Ae3B` (this is the Odyssey v1.2 address of `RoyaltyModule` found [here](https://docs.story.foundation/docs/deployed-smart-contracts)) and the value is >= 2 (that's the amount we're paying in the script).

3. Create a new SPG NFT collection by running `npm run create-spg-collection` in your terminal.

    3a. Look at the console output, and copy the NFT contract address. Add that value as `SPG_NFT_CONTRACT_ADDRESS` to your `.env` file:

    ```
    SPG_NFT_CONTRACT_ADDRESS=SPG_NFT_CONTRACT_ADDRESS
    ```

    **NOTE: You will only have to do this one time. Once you create an SPG collection, you can run this script as many times as you'd like.**

4. `npm run register-deriv-com-short`

## ❌ Run "Dispute IP" Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
    ```

2. `npm run dispute-ip`
