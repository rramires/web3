const HelloTruffle = artifacts.require("HelloTruffle");

contract('HelloTruffle', function(accounts) {

  // create contract before each test
  beforeEach(async() => {
    contract = await HelloTruffle.new();
  })

  it("Should get HelloTruffle", async () => {
    // call method
    const message = await contract.message();
    // validate 
    assert(message === "HelloTruffle", "Message is NOT HelloTruffle");
  })

  it("Should set message", async () => {
    // aux
    const newMessage = "New Message";
    // call methods
    await contract.setMessage(newMessage);
    const message = await contract.message();
    // validate 
    assert(message === newMessage, "Message is NOT New Message");
  })
})
