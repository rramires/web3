import Blockchain from "../src/lib/blockchain";

describe("Blockchain tests", () => {


    test("Should has genesis block", () =>{
        
        const blockchain = new Blockchain();

        console.log(blockchain);
        // test
        expect(blockchain.blocks.length).toEqual(1);
    })
});