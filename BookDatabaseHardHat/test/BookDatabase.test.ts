import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookDatabase", function () {

  // Deploy template
  async function deployFixture() {


    // Aux
    const bookSample = {
        title: "Learning Solidity",
        year: 2022
    }

    // Get owner and other accounts
    const [owner, otherAccount] = await ethers.getSigners();

    // Create the contract that will be tested
    const BookDatabase = await ethers.getContractFactory("BookDatabase");

    // Deploy the contract
    const bookDatabase = await BookDatabase.deploy();

    // Return the contract, owner and other accounts
    return { bookDatabase, owner, otherAccount, bookSample };
  }

  it("Should TOTAL = 0", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

    // Get total
    const total = await bookDatabase.total();

    // Test
    expect(total).to.equal(0);
  });

  it("Should ADD book", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount, bookSample } = await loadFixture(deployFixture);

    // Add book
    await bookDatabase.addBook( bookSample );

    // Get total
    const total = await bookDatabase.total();

    // Test
    expect(total).to.equal(1);
  });

  it("Should EDIT book", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount, bookSample } = await loadFixture(deployFixture);

    // Add book
    await bookDatabase.addBook( bookSample );

    // clone bookSample and change title
    const editedBook = { ...bookSample };
    editedBook.title = "Learning Solidity Edited";

    // Edit book
    await bookDatabase.editBook(1, editedBook);

    // Get book
    const book = await bookDatabase.books(1)

    // Test
    expect(book.title).to.equal(editedBook.title);
  });

  it("Should REMOVE book", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount, bookSample } = await loadFixture(deployFixture);

    // Add book
    await bookDatabase.addBook( bookSample );

    // Edit book
    await bookDatabase.removeBook(1);

    // Get total
    const total = await bookDatabase.total();

    // Test
    expect(total).to.equal(0);
  });

  it("Should NOT REMOVE book(restrict)", async function () {
    // Get contract
    const { bookDatabase, owner, otherAccount, bookSample } = await loadFixture(deployFixture);

    // Connect to other account (default is owner)
    const instance = bookDatabase.connect(otherAccount);

    // Test with revert transaction
    // Edit book (only the owner accesses this method because the "restricted" modifier has been applied)
    await expect(instance.removeBook(1)).to.be.revertedWith("You don't have permission.");
  });

});
