# Story Protocol TypeScript SDK Examples

### Install the Dependencies

```
npm install
```

## Run Non-Commercial Example

1. Add your Sepolia wallet's private key to `.env` file:

```
WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
```

2. `npm run non-commercial`

## Run Commercial Example

1. Add your Sepolia wallet's private key to `.env` file:

```
WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
```

2. You will be paying for the License Token using a [test ERC-20 token](https://sepolia.etherscan.io/address/0xB132A6B7AE652c974EE1557A3521D53d18F6739f#writeContract).

    2a. Go to the above URL and mint some tokens (10 is good).

    2b. Next, you have to allow the royalty contract to spend those tokens on your behalf to mint the License Token. Run the `approve` transaction where the `spender` is the address of `RoyaltyPolicyLAP` [here](https://docs.storyprotocol.xyz/docs/deployed-smart-contracts). And the value is >= 2 (that's the minting fee used in the script).

3. `npm run commercial`
