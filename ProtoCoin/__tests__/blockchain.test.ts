import Blockchain from "../src/lib/blockchain";

describe("Blockchain tests", () => {


    test("Should has genesis block", () =>{
        
        const blockchain = new Blockchain();
        // test
        expect(blockchain.blocks.length).toEqual(1);
    })
});