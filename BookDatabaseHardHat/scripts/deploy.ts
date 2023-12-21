import { ethers } from "hardhat";

async function main() {
  // Get contract and deploy
  const bookDatabase = await ethers.deployContract("BookDatabase");
  // Await to finish
  await bookDatabase.waitForDeployment();

  // Get contract address and print
  const contractAddress = await bookDatabase.getAddress();
  console.log(`BookDatabase has been deployed at: \n${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
