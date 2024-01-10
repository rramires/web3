# BEP-20 Sample + Mint
BEP-20 Token Project Example With OpenZeppelin libs + Mint functions

## Packages
```shell
npm init -y 

npm i dotenv  

npm i -D hardhat

npx hardhat init

npm i -D @nomicfoundation/hardhat-verify 

npm i @openzeppelin/contracts 
```

## Run and Tests

```shell
# Compile
npm run compile 

# Test 
npm test

# Deploy 
npm run deploy 
```

## Deploy

```shell
# Localhost
npm run deploy

# Sepolia via Infura
npm run deploy_testnet   
```

## Verify contract

```shell
# npx hardhat verify --network sepolia Your Contract Address 
# Use apiKey: process.env.ETHSCAN_API in hardhat.config.ts
npx hardhat verify --network sepolia 0x2e098...etc

# Use apiKey: process.env.BSCSCAN_API in hardhat.config.ts
npx hardhat verify --network bsctest 0x2e098...etc
```