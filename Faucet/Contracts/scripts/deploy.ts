import { ethers } from "hardhat";

async function main() {
  // Get contract and deploy
  const contract = await ethers.deployContract("BEP20");
  // Await to finish
  await contract.waitForDeployment();

  // Get contract address and print
  const address = await contract.getAddress();
  console.log(`ERC20 has been deployed at: \n${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
