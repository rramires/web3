const BookDatabase = artifacts.require("BookDatabase");

contract('BookDatabase', function(accounts) {

  // create contract before each test
  beforeEach(async() => {
    contract = await BookDatabase.new();
  })

  it("Should get total = 0", async () => {
    // call method
    const total = await contract.total();
    // validate 
    assert(total.toNumber() === 0, "Count is NOT zero.");
  })
})
