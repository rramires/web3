const {
  BN,  
  time
} = require('@openzeppelin/test-helpers');

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
    assert(name == "ProtoTokenOz", "Incorrect name.");
  })

  it("Should has correct symbol", async () => {
    // get 
    const symbol = await contract.symbol();
    // validate 
    assert(symbol == "PROTZ", "Incorrect symbol.");
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

    /* console.log( Number(fromBalanceBefore) / 10 ** 18 );
    console.log( Number(toBalanceBefore) / 10 ** 18 ); */
    
    // transfer
    await contract.transfer(accounts[1], qty);

    // get after
    const fromBalanceAfter = await contract.balanceOf(accounts[0]);
    const toBalanceAfter = await contract.balanceOf(accounts[1]);
    
    /* console.log( Number(fromBalanceAfter) / 10 ** 18 );
    console.log( Number(toBalanceAfter) / 10 ** 18 );  */

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
      assert.include(err.message, "revert", "The transfer should be reverted.");
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

  it("Should transfer from", async () => {
    // set 
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    // get before
    const allowanceBefore = await contract.allowance(accounts[0], accounts[1]);
    const fromBalanceBefore = await contract.balanceOf(accounts[0]);
    const toBalanceBefore = await contract.balanceOf(accounts[1]);

    /* console.log( Number(allowanceBefore) / 10 ** 18 );
    console.log( Number(fromBalanceBefore) / 10 ** 18 );
    console.log( Number(toBalanceBefore) / 10 ** 18 ); */

    // approve
    await contract.approve(accounts[1], qty);
    
    // transfer
    await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] } ); // { change default caller }

    // get after
    const allowanceAfter = await contract.allowance(accounts[0], accounts[1]);
    const fromBalanceAfter = await contract.balanceOf(accounts[0]);
    const toBalanceAfter = await contract.balanceOf(accounts[1]);
    
    /* console.log( Number(allowanceAfter) / 10 ** 18 );
    console.log( Number(fromBalanceAfter) / 10 ** 18 );
    console.log( Number(toBalanceAfter) / 10 ** 18 );  */
    
    // validate 
    assert(allowanceAfter.eq(allowanceBefore), "Incorrect allowance.");
    assert(fromBalanceAfter.eq(fromBalanceBefore.sub(qty)), "Incorrect from balance.");
    assert(toBalanceAfter.eq(toBalanceBefore.add(qty)), "Incorrect to balance.");
  })

  it("Should NOT transfer from", async () => {
    // set 
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS)); 

    // catches the revert transaction
    try{
      // transfer without allowance
      await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] } );
      // if not fail, create error
      assert.fail("The transfer from should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The transfer from should be reverted.");
    }
  })

  it("Should mint once", async () => {

    // set mint amount
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    // get before
    const balanceBefore = await contract.balanceOf(accounts[1]);

    // console.log( Number(balanceBefore) );
    
    // mint to account 1
    await contract.mint( { from: accounts[1] } ); 

    // get after
    const balanceAfter = await contract.balanceOf(accounts[1]);
    
    // console.log( Number(balanceAfter) );
    
    // validate 
    assert(balanceAfter.eq(balanceBefore.add(mintAmount)), "Incorrect balance.");
  })

  it("Should mint twice (different accounts)", async () => {

    // set mint amount
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    // get before
    const balance1_Before = await contract.balanceOf(accounts[1]);
    const balance2_Before = await contract.balanceOf(accounts[2]);

    // console.log( Number(balance1_Before), Number(balance2_Before) );
    
    // mint to account 1 and 2
    await contract.mint( { from: accounts[1] } ); 
    await contract.mint( { from: accounts[2] } ); 

    // get after
    const balance1_After = await contract.balanceOf(accounts[1]);
    const balance2_After = await contract.balanceOf(accounts[2]);
    
    // console.log( Number(balance1_After), Number(balance2_After) );
    
    // validate 
    assert(balance1_After.eq(balance1_Before.add(mintAmount)), "Incorrect balance 1.");
    assert(balance2_After.eq(balance2_Before.add(mintAmount)), "Incorrect balance 2.");
  })

  it("Should mint twice (different moments)", async () => {

    // set mint amount
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    // set delay
    const delayInSeconds = 1;
    await contract.setMintDelay(delayInSeconds); 

    // get before
    const balanceBefore = await contract.balanceOf(accounts[1]);

    // console.log( Number(balanceBefore) );
    
    // mint to account 1
    await contract.mint({ from: accounts[1] } ); 
    
    // add 2 seconds interval by openzeppelin test-helpers
    await time.increase(delayInSeconds * 2);

    // mint again
    await contract.mint({ from: accounts[1] } ); 

    // get after
    const balanceAfter = await contract.balanceOf(accounts[1]);
    
    // console.log( Number(balanceAfter) );
    
    // validate 
    assert(balanceAfter.eq(balanceBefore.add( new BN(mintAmount * 2) )), "Incorrect balance.");
  })

  it("Should NOT setMintAmount (permission)", async () => {
    // catches the revert transaction
    try{
      // set without allowance
      await contract.setMintAmount(1, { from: accounts[1] } );
      // if not fail, create error
      assert.fail("The setMintAmount should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The setMintAmount should be reverted.");
    }
  })

  it("Should NOT setMintDelay (permission)", async () => {
    // catches the revert transaction
    try{
      // set without allowance
      await contract.setMintDelay(1, { from: accounts[1] } );
      // if not fail, create error
      assert.fail("The setMintDelay should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The setMintDelay should be reverted.");
    }
  })

  it("Should NOT mint (disabled)", async () => {
    // catches the revert transaction
    try{
      // the mint default is 0 (disabled)
      await contract.mint({ from: accounts[1] } );
      // if not fail, create error
      assert.fail("The mint should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The mint should be reverted.");
    }
  })

  it("Should NOT mint twice", async () => {

    // set mint amount
    await contract.setMintAmount(new BN(1000));

    // mint - first time OK
    await contract.mint({ from: accounts[1] } ); 

    // catches the revert transaction
    try{
      // 
      await contract.mint({ from: accounts[1] } );
      // if not fail, create error
      assert.fail("The mint twice should have thrown an error.");
    }
    catch(err){
      // find "revert" from message
      assert.include(err.message, "revert", "The mint twice should be reverted.");
    }
  })
})
