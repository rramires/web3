import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Validation from "../src/lib/validation";

// mocks
jest.mock('../src/lib/block');


describe("Blockchain tests", () => {

    test("Should has genesis block", () =>{
        const blockchain = new Blockchain();
        // test
        expect(blockchain.chain.length).toEqual(1);
    })

    test("Should be valid (only genesis)", () =>{
        const blockchain = new Blockchain();
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.VALID_BLOCKCHAIN);
    }) 

    test("Should add block", () =>{
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.BLOCK_ADDED);
    })

    test("Should NOT add block", () =>{
        const blockchain = new Blockchain();
        // add INVALID block
        const block: Block = new Block(-1, "invalidHash", "Block 2");
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK(Block.INVALID_BLOCK.message));
    })

    test("Should get block", () =>{
        const blockchain = new Blockchain();
        // get block
        const block = blockchain.getBlock(blockchain.chain[0].hash)
        // test
        expect(block).toBeTruthy();
    })

    test("Should be valid (two blocks)", () =>{
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        blockchain.addBlock(block);
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.VALID_BLOCKCHAIN);
    })  

    test("Should be INVALID (two blocks)", () =>{
        const invalidIndex: number = -1
        const blockchain = new Blockchain();
        // add block
        const block: Block = new Block(1, blockchain.chain[0].hash, "Block 2");
        blockchain.addBlock(block);
        blockchain.chain[1].index = invalidIndex; // invalidate index
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK_NO(invalidIndex, Block.INVALID_BLOCK.message));
    })
});