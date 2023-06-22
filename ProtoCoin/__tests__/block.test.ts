import Block from "../src/lib/block";
import Validation from "../src/lib/validation";

describe("Block tests", () => {
    //
    const mockDifficulty = 0;
    const mockMiner: string = "testMiner";

    let genesis: Block;
    beforeAll(() =>{
        genesis = Block.genesis();
    })

    test("Should be valid", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
              block.mine(mockDifficulty, mockMiner);
        //
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeTruthy();
    })


    test("Should NOT be valid (index)", () =>{

        const block = new Block(-1, genesis.hash, "fakeData");
              block.mine(mockDifficulty, mockMiner);
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
              block.mine(mockDifficulty, mockMiner);
        block.timestamp = -1; // invalid timestamp
        block.hash = block.getHash(); // update hash with new timestamp
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    })
    
    test("Should NOT be valid (previousHash)", () =>{

        const block = new Block(1, "invalidHash", "fakeData");
              block.mine(mockDifficulty, mockMiner);
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    })

    test("Should NOT be valid (data)", () =>{

        const block = new Block(1, genesis.hash, "");
              block.mine(mockDifficulty, mockMiner);
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    })

    test("Should NOT be valid (hash)", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
              block.mine(mockDifficulty, mockMiner);
        block.hash = ""; // invalid hash
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    })

    test("Should NOT be mined", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
        block.nonce = -1; // invalid miner
        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid.success).toBeFalsy();
    }) 
});