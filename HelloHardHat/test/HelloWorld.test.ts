import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {

  // Deploy template
  async function deployFixture() {

    // Get owner and other accounts
    const [owner, otherAccount] = await ethers.getSigners();

    // Create the contract that will be tested
    const HelloWorld = await ethers.getContractFactory("HelloWorld");

    // Deploy the contract
    const helloWorld = await HelloWorld.deploy();

    // Return the contract, owner and other accounts
    return { helloWorld, owner, otherAccount };
  }

  it("Should GET message", async function () {
    // Get contract
    const { helloWorld, owner, otherAccount } = await loadFixture(deployFixture);

    // Get message
    const message = await helloWorld.message();

    // Test
    expect(message).to.equal("Hello World");
  });

  it("Should SET message", async function () {
    // Get contract
    const { helloWorld, owner, otherAccount } = await loadFixture(deployFixture);

    const newMessage = "Other Message";

    // Set message
    await helloWorld.setMessage(newMessage);

    // Get message
    const message = await helloWorld.message();

    // Test
    expect(message).to.equal(newMessage);
  });
});
