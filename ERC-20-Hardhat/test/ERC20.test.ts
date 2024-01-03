import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20 Tests", function () {
  
  async function deployFixture() {
    
    // Get owner and other accounts
    const [owner, otherAccount] = await ethers.getSigners();

    // Create the contract that will be tested
    const ERC20 = await ethers.getContractFactory("ERC20");

    // Deploy
    const erc20 = await ERC20.deploy();

    // Return the contract, owner and other accounts
    return { erc20, owner, otherAccount };
  }

  // Test sample
  it("Should test", async function () {
    const { erc20, owner, otherAccount } = await loadFixture(deployFixture);

    // Test
    expect(true).to.equal(true);
  });

});
