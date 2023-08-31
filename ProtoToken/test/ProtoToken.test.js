const ProtoToken = artifacts.require("ProtoToken");

contract('ProtoToken', function(accounts) {

  // create contract before each test
  beforeEach(async() => {
    contract = await ProtoToken.new();
  })

  it("Should ... ", async () => {
    // validate 
    assert(true, "Error Message");
  })
})
