import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookDatabase", function () {

  // Deploy template
  async function deployFixture() {

    // Get owner and other accounts
    const [owner, otherAccount] = await ethers.getSigners();

    // Create the contract that will be tested
    const BookDatabase = await ethers.getContractFactory("BookDatabase");

    // Deploy the contract
    const bookDatabase = await BookDatabase.deploy();

    // Return the contract, owner and other accounts
    return { bookDatabase, owner, otherAccount };
  }

  it("Should TOTAL = 0", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

    // Get total
    const total = await bookDatabase.total();

    // Test
    expect(total).to.equal(0);
  });

  

});
