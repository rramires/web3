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
    const contract = await ERC20.deploy();

    // Total supply
    const total = 21000000n * 10n ** 18n

    // Return the contract, owner and other accounts
    return { contract, total, owner, otherAccount };
  }

  // Tests

  it("Should have correct name", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const name = await contract.name();

    // Test
    expect(name).to.equal("ERCSample");
  });
  
  it("Should have correct symbol", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const symbol = await contract.symbol();

    // Test
    expect(symbol).to.equal("ERCS");
  });

  it("Should have correct decimals", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const decimals = await contract.decimals();

    // Test
    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const totalSupply = await contract.totalSupply();

    // Test
    expect(totalSupply).to.equal(total);
  });

  it("Should get balance", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const balance = await contract.balanceOf(owner.address);

    // Test
    expect(balance).to.equal(total);
  });

  it("Should transfer", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set 
    const qty = 1n;

    // Get before
    const fromBalanceBefore = await contract.balanceOf(owner.address);
    const toBalanceBefore = await contract.balanceOf(otherAccount.address);

    // Transfer
    await contract.transfer(otherAccount.address, qty);

    // Get after
    const fromBalanceAfter = await contract.balanceOf(owner.address);
    const toBalanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(fromBalanceBefore).to.equal(total);
    expect(toBalanceBefore).to.equal(0n);
    expect(fromBalanceAfter).to.equal(total -1n);
    expect(toBalanceAfter).to.equal(1n);
  });

  it("Should NOT transfer", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set 
    const qty = 1n;

    // Transfer from the other account with 0 balance
    const otherContract = contract.connect(otherAccount);

    // Test revert transaction with message
    await expect( otherContract.transfer(owner, qty) ).to.be.revertedWith("Insufficient balance.");
  });
});
