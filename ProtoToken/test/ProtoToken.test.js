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
    assert(totalSupply.eq(TOTAL_SUPPLY), "Incorrect total supply.");
  })

  it("Owner should has total supply", async () => {
    // set 21 millions of coins
    const TOTAL_SUPPLY = new BN(21000000).mul(new BN(10).pow(DECIMALS));
    // get 
    const ownerBalance = await contract.balanceOf(accounts[0]);
    //console.log( Number(ownerBalance) / 10 ** 18 );
    // validate 
    assert(ownerBalance.eq(TOTAL_SUPPLY), "Incorrect owner balance.");
  })

  it("Should transfer", async () => {
    // set 
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));
    // get before
    const fromBalanceBefore = await contract.balanceOf(accounts[0]);
    const toBalanceBefore = await contract.balanceOf(accounts[1]);
    
    // transfer
    await contract.transfer(accounts[1], qty);

    // get after
    const fromBalanceAfter = await contract.balanceOf(accounts[0]);
    const toBalanceAfter = await contract.balanceOf(accounts[1]);
    
    /* console.log( Number(fromBalanceBefore) / 10 ** 18 );
    console.log( Number(fromBalanceAfter) / 10 ** 18 );
    console.log( Number(toBalanceBefore) / 10 ** 18 );
    console.log( Number(toBalanceAfter) / 10 ** 18 ); */

    // validate 
    assert(fromBalanceAfter.eq(fromBalanceBefore.sub(qty)), "Incorrect from balance.");
    assert(toBalanceAfter.eq(toBalanceBefore.add(qty)), "Incorrect to balance.");
  })

  it("Should NOT transfer", async () => {
    // set invalid - one more than the total
    const qty = new BN(21000001).mul(new BN(10).pow(DECIMALS)); 

    // catches the revert transaction
    try{
      // transfer
      await contract.transfer(accounts[1], qty);
      // if not fail, create error
      assert.fail("The transfer should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The transfer should br reverted.");
    }
  })

  it("Should approve", async () => {
    // set 
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));
    
    // approve
    await contract.approve(accounts[1], qty);

    // get
    const allowance = await contract.allowance(accounts[0], accounts[1]);
    
    // console.log(Number(allowance) / 10 ** 18 );

    // validate 
    assert(allowance.eq(qty), "Incorrect allowance balance.");
  })
})
