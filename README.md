# Story Protocol TypeScript SDK Examples

## Get started

```
npm install 
```

- Add your private key and RPC URL to a `.env` file
- Add your ERC721 NFT contract address and token ID to the `.env` file

```
RPC_PROVIDER_URL=<YOUR_SEPOLIA_RPC_URL>
WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
MY_NFT_CONTRACT_ADDRESS=<YOUR_ERC721_NFT_CONTRACT_ADDRESS>
MY_NFT_TOKEN_ID=<YOUR_ERC721_NFT_TOKEN_ID>
```

## Run 
- Follow along `createIpAssetAndLicense.ts` to create an IP Asset and licenses
```
npx ts-node scripts/createIpAssetAndLicense.ts
```
