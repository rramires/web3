import { ethers } from "hardhat";

async function main() {
  const bookDatabase = await ethers.deployContract("BookDatabase");

  await bookDatabase.waitForDeployment();

  console.log('BookDatabase has been deployed');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
