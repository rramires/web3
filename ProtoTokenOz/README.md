# ProtoToken
ERC-20 OpenZeppelin implementation

## Packages
npm i dotenv   

npm i -g truffle

npm i @truffle/hdwallet-provider

npm i -D truffle-plugin-verify 

npm install @openzeppelin/contracts    

## Deploy
truffle migrate --network goerli 
or
truffle migrate --network bsctest

## Verify contract
truffle run verify ProtoToken@YourContractAddress --network goerli --verifiers=etherscan
or
truffle run verify ProtoToken@YourContractAddress --network bsctest --verifiers=bscscan
// error(truffle-plugin-verify has no support for verifier bscscan, supported verifiers: etherscan,sourcify) 

