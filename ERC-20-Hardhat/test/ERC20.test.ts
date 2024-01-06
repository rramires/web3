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

    // get 
    const name = await contract.name();

    // Test
    expect(name).to.equal("ERCSample");
  });
  
  it("Should have correct symbol", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const symbol = await contract.symbol();

    // Test
    expect(symbol).to.equal("ERCS");
  });

  it("Should have correct decimals", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const decimals = await contract.decimals();

    // Test
    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const totalSupply = await contract.totalSupply();

    // Test
    expect(totalSupply).to.equal(total);
  });

  it("Should get balance", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // get 
    const balance = await contract.balanceOf(owner.address);

    // Test
    expect(balance).to.equal(total);
  });

  it("Should transfer", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // set 
    const qty = 1n;

    // get before
    const fromBalanceBefore = await contract.balanceOf(owner.address);
    const toBalanceBefore = await contract.balanceOf(otherAccount.address);

    // transfer
    await contract.transfer(otherAccount.address, qty);

    const fromBalanceAfter = await contract.balanceOf(owner.address);
    const toBalanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(fromBalanceBefore).to.equal(total);
    expect(toBalanceBefore).to.equal(0n);
    expect(fromBalanceAfter).to.equal(total -1n);
    expect(toBalanceAfter).to.equal(1n);
  });
});
