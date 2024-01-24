import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BEP20v2 Tests", function () {
  
  async function deployFixture() {
    
    // Get owner and other accounts
    const [owner, otherAccount] = await ethers.getSigners();

    // Create the contract that will be tested
    const Contract = await ethers.getContractFactory("BEP20v2");

    // Deploy
    const contract = await Contract.deploy();

    // Total supply
    const total = 21000000n * 10n ** 18n

    // Return the contract, owner and other accounts
    return { contract, total, owner, otherAccount };
  }

  // Token Tests

  it("Should have correct name", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const name = await contract.name();

    // Test
    expect(name).to.equal("BEPSampleV2");
  });
  
  it("Should have correct symbol", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Get 
    const symbol = await contract.symbol();

    // Test
    expect(symbol).to.equal("BEPS2");
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
    expect(fromBalanceAfter).to.equal(total - qty);
    expect(toBalanceAfter).to.equal(qty);
  });

  it("Should NOT transfer", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set 
    const qty = 1n;

    // Transfer from the other account with 0 balance
    const otherContract = contract.connect(otherAccount);

    // Test revert transaction with message
    await expect( otherContract.transfer(owner, qty) )
              .to.be.revertedWithCustomError(contract, "ERC20InsufficientBalance");
  });

  it("Should approve and allowance", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Approve 
    await contract.approve(otherAccount.address, 1n);

    // Check approval
    const value = await contract.allowance(owner.address, otherAccount.address);

    // Test
    expect(value).to.equal(1n);
  });

  it("Should transferFrom", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set 
    const qty = 1n;
    const otherContract = contract.connect(otherAccount);

    // Get before
    const fromBalanceBefore = await contract.balanceOf(owner.address);
    const toBalanceBefore = await contract.balanceOf(otherAccount.address);

    // Approve other otherAccount to tranfer 2
    await contract.approve(otherAccount.address, (qty * 2n));

    // Transfer 1
    await otherContract.transferFrom(owner.address, otherAccount.address, qty);

    // Get rest
    const allowance = await otherContract.allowance(owner.address, otherAccount.address);

    // Get after
    const fromBalanceAfter = await contract.balanceOf(owner.address);
    const toBalanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(fromBalanceBefore).to.equal(total);
    expect(toBalanceBefore).to.equal(0n);
    expect(fromBalanceAfter).to.equal(total - qty);
    expect(toBalanceAfter).to.equal(qty);
    expect(allowance).to.equal(qty);
  });

  it("Should NOT transferFrom (allowance)", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Transfer from the other account with 0 balance
    const otherContract = contract.connect(otherAccount);

    // Allowance was not called!

    // Test revert transaction with message
    await expect( otherContract.transferFrom(owner.address, otherAccount.address, 1n) )
              .to.be.revertedWithCustomError(contract, "ERC20InsufficientAllowance");
  });

   it("Should NOT transferFrom (balance)", async function () {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set 
    const qty = 1n;
    const otherContract = contract.connect(otherAccount);

    // Approve contract to tranfer
    await otherContract.approve(owner.address, qty);

    // Test revert transaction with message, because otherAccount balance is 0
    await expect( contract.transferFrom(otherAccount.address, owner.address, qty))
              .to.be.revertedWithCustomError(contract, "ERC20InsufficientBalance");
  });

  // Mint tests

  it("Should mint once", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintAmount = 1000n;
    await contract.setMintAmount(mintAmount);

    const balanceBefore = await contract.balanceOf(otherAccount.address);

    await contract.mint(otherAccount.address); 

    const balanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(balanceAfter).to.equal(balanceBefore + mintAmount);
  });

  it("Should mint once (different accounts)", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintAmount = 1000n;
    await contract.setMintAmount(mintAmount);

    const ownerBalanceBefore = await contract.balanceOf(owner.address);
    const otherBalanceBefore = await contract.balanceOf(otherAccount.address);

    // Mint owner
    await contract.mint(owner.address); 

    // Mint other
    await contract.mint(otherAccount.address); 

    const ownerBalanceAfter = await contract.balanceOf(owner.address);
    const otherBalanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + mintAmount);
    expect(otherBalanceAfter).to.equal(otherBalanceBefore + mintAmount);
  });

  it("Should mint once (different moments)", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintAmount = 1000n;
    await contract.setMintAmount(mintAmount);

    const ownerBalanceBefore = await contract.balanceOf(otherAccount.address);

    // Mint owner
    await contract.mint(otherAccount.address); 

    // Time lapse
    const mintDelay = 60 * 60 * 24 + 1; // 1 day in seconds
    await time.increase(mintDelay + 1); // Added 1 second

    await contract.mint(otherAccount.address);

    const ownerBalanceAfter = await contract.balanceOf(otherAccount.address);

    // Tests
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + (mintAmount * 2n));
  });

  it("Should NOT mint", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);
   
     // Test revert transaction with message
     await expect( contract.mint(otherAccount.address) ).to.be.revertedWith("Minting is not enabled.");
  });

  it("Should NOT mint twice", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintAmount = 1000n;
    await contract.setMintAmount(mintAmount);

    // Mint owner
    await contract.mint(otherAccount.address); 
    
    // NO time lapse
    // Test revert transaction with message
    await expect( contract.mint(otherAccount.address) ).to.be.revertedWith("You cannot mint twice in a row.");
  });  

  it("Should NOT set mint amount", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintAmount = 1000n;
    const otherContract = contract.connect(otherAccount);
   
     // Test revert transaction with message
     await expect( otherContract.setMintAmount(mintAmount) ).to.be.revertedWith("You do not have permission.");
  });

  it("Should NOT set mint delay", async function() {
    const { contract, total, owner, otherAccount } = await loadFixture(deployFixture);

    // Set
    const mintDelay = 1;
    const otherContract = contract.connect(otherAccount);
   
     // Test revert transaction with message
     await expect( otherContract.setMintDelay(mintDelay) ).to.be.revertedWith("You do not have permission.");
  });
});


