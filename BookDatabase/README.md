# BookDatabase
Example project, to study the configuration, deployment and contract verification processes

## Packages
npm i dotenv   

npm i -g truffle

npm i @truffle/hdwallet-provider

npm i -D truffle-plugin-verify 

## Deploy
truffle migrate --network goerli 

## Verify contract
truffle run verify BookDatabase@ContractAddress --network UsedNetwork