Hi there claude. In short, I want to support making cross-chain royalty payments using deBridge as the solution, such that someone could pay on Ethereum mainnet for example and have it automatically bridged to Story and pay a function called `payRoyaltyOnBehalf` in a RoyaltyModule contract in $WIP token.

I was talking to the deBridge team and they said it's fully possible. Here is a full conversation as context.

Story team: "What's the work needed to integrate this? It seems like this can already happen contract-wise, e.g. an NFT sale on Ethereum pays royalty to parent IP on Story through deBridge (initiate bridge w/ externalCall which calls payRoyaltyOnBehalf to auto-transfer the bridged fund). But require web & UI/UX integrations to provide the feature for end users."

deBridge team: "Exactly how you described it! In your example the UI of that nft sale would indeed just execute a tx with externalCall with a transaction to payRoyaltyOnBehalf 👍"

Story team: "Do you have any examples of how this would be done? Or how to call the externalCall function and what parameters we might provide?"

deBridge team: "Here you see an example of of depositing on AAVE upon fullfilment and params:
https://docs.debridge.finance/dln-the-debridge-liquidity-network-protocol/interacting-with-the-api/integrating-debridge-hooks#transaction-call-hook-for-evm
also externalCall in
https://api.dln.trade/v1.0/#/DLN/DlnOrderControllerV10_createOrder"

Story team (days later): "Want to revisit this. What is the flow that you're thinking?

ex. someone buys an NFT with $eth on eth mainnet, then sends a tx to payRoyaltyOnBehalf and swap the $eth for $wip to make the royalty payment on story? Does this make sense?"

deBridge team: "Hmm they would rather swap the $eth to $wip in a "bundled" transaction that include externalCall to call payRoyaltyOnBehalf to make the royalty payment.

The sequence is:
1/ call create-tx with the proper externalCall field that will include the transaction call to the destination SC address to call payRoyaltyOnBehalf.

2/ Exectude the transaction data returned by the deBridge API

It has to be all mainnet tho.
I would first try to get the tx-data payload from the api with the extra dlnHook(legacy externalCall) parameter and execute it.

Closest example is create_bridge_order and execute_bridge_transaction in:
https://github.com/goat-sdk/goat/blob/main/typescript/packages/plugins/debridge/src/tools.ts"

Story team: "Lets say this is Ethereum and Story. We would first need to call the api to get the tx-data, then execute a tx where the user is paying in Eth and debridge automatically sends it to story as $WIP and it pays out through payRoyaltyOnBehalf?

1. What would the parameters be for the api call?
2. How do you execute the tx using the tx-data to bridge eth into $WIP and call that function"

deBridge team: "Yes
1/ We would first need to call the api to get the tx-data making sure the dlnHook field is filled as parameter
https://dln.debridge.finance/v1.0#/DLN/DlnOrderControllerV10_createOrder
2/ Execute a tx where the user is paying in Eth and debridge automatically sends it to story as $WIP and it pays out through payRoyaltyOnBehalf

pls check the parameter payload format for dlnHook (legacy externalCall)🫠️️
https://dln.debridge.finance/v1.0#/DLN/DlnOrderControllerV10_createOrder
https://docs.debridge.finance/dln-the-debridge-liquidity-network-protocol/interacting-with-the-api/integrating-debridge-hooks#transaction-call-hook-for-evm

The demo shows how the api called with the dlnHool parameter here:
https://github.com/gabrielantonyxaviour/debridge-story-royalties-relayer/blob/be989ff8eaa0de9aa8a669a3a6ed98481a69ea75/lib/debridge.ts#L30C521-L30C528
But a multicall SC has been used to overcome the approve"
