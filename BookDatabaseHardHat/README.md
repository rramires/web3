# BookDatabase
Example project, to study the configuration, deployment and contract verification processes

## Packages
```shell
npm init -y 

npm i dotenv 

npm i -D @nomiclabs/hardhat-etherscan

npm i -D hardhat

npx hardhat init
```
Select TypeScript project  
Add .gitignore? Y  
Sample Project...? Y  

## Deploy

```shell
# Localhost
npm run deploy

# Sepolia via Infura
npx hardhat run scripts/deploy.ts --network sepolia
```

## Interacting via console

```shell
# Start console
npx hardhat console

# List object with commands
ethers 
# > says a big object

# Interact with contract (Contract Name, Contract Address)
const contract = await ethers.getContractAt("BookDatabase", "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0");
# > undefined

# Add books
await contract.addBook({title: "New Book", year: 2023});
await contract.addBook({title: "New Book 2", year: 2024});

# Get number of records
await contract.total();

# Get book
await contract.books(1);

# Edit book
await contract.editBook(1, {title: "Book Edited", year: 2015});
await contract.books(1);

# Remove book
await contract.removeBook(1);
await contract.total();
```

## Verify contract

```shell
# npx hardhat verify --network sepolia Your Contract Address 
npx hardhat verify --network sepolia 0x2e098...etc
```
