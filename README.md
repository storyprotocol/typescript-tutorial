# Story Protocol TypeScript SDK Examples

### Install the Dependencies

```
npm install
```

## Run Non-Commercial Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

```
WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
```

2. `npm run non-commercial`

## Run Commercial Example

1. Add your Story Network Testnet wallet's private key to `.env` file:

```
WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
```

2. You will be paying for the License Token using a [test ERC-20 token](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7).

    2a. Mint some tokens by running [this](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7?tab=write_contract#40c10f19) transaction (10 is good).

    2b. Next, you have to allow the royalty contract to spend those tokens on your behalf to mint the License Token. Run the [approve transaction](https://testnet.storyscan.xyz/address/0x91f6F05B08c16769d3c85867548615d270C42fC7?tab=write_contract#095ea7b3) where the `spender` is the address of `RoyaltyPolicyLAP` [here](https://docs.storyprotocol.xyz/docs/deployed-smart-contracts). And the value is >= 1 (that's the minting fee used in the script).

3. `npm run commercial`
