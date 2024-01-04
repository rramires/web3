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

  // Tests

  it("Should have correct name", async function () {
    const { erc20, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const name = await erc20.name();

    // Test
    expect(name).to.equal("ERCSample");
  });
  
  it("Should have correct symbol", async function () {
    const { erc20, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const symbol = await erc20.symbol();

    // Test
    expect(symbol).to.equal("ERCS");
  });

  it("Should have correct decimals", async function () {
    const { erc20, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const decimals = await erc20.decimals();

    // Test
    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { erc20, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const totalSupply = await erc20.totalSupply();

    // Test
    expect(totalSupply).to.equal(21000000n * 10n ** 18n);
  });
});
