const BookDatabase = artifacts.require("BookDatabase");

contract('BookDatabase', function(accounts) {

  // Aux
  const bookSample = {
      title: "Learning Solidity",
      year: 2022
  }

  // Create contract before each test
  beforeEach(async() => {
    contract = await BookDatabase.new();
  })


  it("Should get total = 0", async () => {
    // Get total
    const total = await contract.total();
    // Validate 
    assert(total.toNumber() === 0, "Count is NOT zero.");
  })

  it("Should ADD book", async () => {
    // Add book
    await contract.addBook(bookSample);
    // Get total
    const total = await contract.total();  
    // Validate 
    assert(total.toNumber() === 1, "Count is ONE.");
  })

  it("Should GET book", async () => {
    // Add book
    await contract.addBook(bookSample);
    // Get first book
    const book = await contract.books(1); 
    // Validate 
    assert(book.title === bookSample.title, "The book has not been added.");
  })

  it("Should EDIT book (tittle)", async () => {
    // Add book
    await contract.addBook(bookSample);
    // Different year
    const newTitle = "Learning Javascript"; 
    // Edit book
    await contract.editBook(1, // first book
    { 
      title: newTitle,
      year: 0
    })
    // Get first book
    const book = await contract.books(1); 
    // validate 
    assert(book.year.toNumber() === bookSample.year && book.title === newTitle, "The book title has not been edited.");
  })

  it("Should EDIT book (year)", async () => {
    // Add book
    await contract.addBook(bookSample);
    // Different year
    const newYear = 2023; 
    // Edit book
    await contract.editBook(1, // first book
    { 
      title: "",
      year: newYear
    })
    // Get first book
    const book = await contract.books(1); 
    // validate 
    assert(book.year.toNumber() === newYear && book.title === bookSample.title, "The book year has not been edited.");
  })

  it("Should REMOVE book", async () => {
    // Add book
    await contract.addBook(bookSample);
    // Remove book
    await contract.removeBook(1, { from: accounts[0] }); // from: accounts[0] is default  
    // Get total
    const total = await contract.total();  
    // Validate 
    assert(total.toNumber() === 0, "The book has not been removed.");
  })

  it("Should NOT PERMISSION to remove book (restricted modifier test)", async () => {
    // For this test to pass, the "restricted" error must occur
    try{
      // Account changed to a different from contract creation, to force permission error
      await contract.removeBook(1, { from: accounts[1] }); 
      // If restricted fail, sets an error
      assert.fail("The book was removed without permission.");
    }
    catch(err){
      // err.message returns "revert You don't have permission." 
      // includes find strings. In this case, find "revert" word
      assert.include(err.message, "revert", "The error shoud revert the transaction.");
    }    
  })
})
