import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Validation from "../src/lib/validation";

describe("Blockchain tests", () => {

    test("Should has genesis block", () =>{
        const blockchain = new Blockchain();
        // test
        expect(blockchain.chain.length).toEqual(1);
    })

    test("Should be valid (only genesis)", () =>{
        const blockchain = new Blockchain();
        // test
        expect(blockchain.isValid().success).toEqual(true);
    }) 

    test("Should add block", () =>{
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation.success).toEqual(true);
    })

    test("Should NOT add block", () =>{
        const blockchain = new Blockchain();
        // add INVALID block
        const block: Block = new Block(-1, "invalidHash", "Block 2");
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation.success).toEqual(false);
    })

    test("Should get block", () =>{
        const blockchain = new Blockchain();
        // add block
        const block = blockchain.getBlock(blockchain.chain[0].hash)
        // test
        expect(block).toBeTruthy();
    })

    test("Should be valid (two blocks)", () =>{
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        blockchain.addBlock(block);
        // test
        expect(blockchain.isValid().success).toEqual(true);
    })    

    test("Should be INVALID (two blocks)", () =>{
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        blockchain.addBlock(block);
        blockchain.chain[1].data = "adulterated data..."; // invalidate data
        // test
        expect(blockchain.isValid().success).toEqual(false);
    })
});