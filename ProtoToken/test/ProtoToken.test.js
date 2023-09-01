const BN = require("bn.js");

const ProtoToken = artifacts.require("ProtoToken");

contract('ProtoToken', function(accounts) {

  // aux
  const DECIMALS = new BN(18);


  // create contract before each test
  beforeEach(async() => {
    contract = await ProtoToken.new();
  })


  it("Should has correct name", async () => {
    // get 
    const name = await contract.name();
    // validate 
    assert(name == "ProtoToken", "Incorrect name.");
  })

  it("Should has correct symbol", async () => {
    // get 
    const symbol = await contract.symbol();
    // validate 
    assert(symbol == "PROTK", "Incorrect symbol.");
  })

  it("Should has correct decimals", async () => {
    // get 
    const decimals = await contract.decimals(); // returns big number
    // validate 
    assert(decimals.eq(DECIMALS), "Incorrect decimals."); // uses big number eq to compare
  })

  it("Should has correct total supply", async () => {
    // set 21 millions of coins
    const TOTAL_SUPPLY = new BN(21000000).mul(new BN(10).pow(DECIMALS));
    // get 
    const totalSupply = await contract.totalSupply();
    // validate 
    assert(totalSupply.eq(TOTAL_SUPPLY), "Incorrect totalSupply.");
  })
})
