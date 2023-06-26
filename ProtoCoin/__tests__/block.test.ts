import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
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

        const block = new Block({index: 1,
                                 previousHash: genesis.hash,
                                 data: "fakeData"} as Block); // this params test constructor
        block.mine(mockDifficulty, mockMiner);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.data = "fakeData";
        block.mine(mockDifficulty, mockMiner);

        block.timestamp = -1; // invalid timestamp
        block.hash = block.getHash(); // update hash with new timestamp

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_TIMESTAMP);
    })

    test("Should NOT be valid (data)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.data = ""; // invalid data
        block.mine(mockDifficulty, mockMiner);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_DATA);
    })

    test("Should NOT be mined", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.data = "fakeData";
        block.nonce = -1; // invalid nonce 

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.NO_MINED);
    })

    test("Should NOT be valid (index)", () =>{

        const block = new Block();
        block.index = -1 // invalid index
        block.previousHash = genesis.hash;
        block.data = "fakeData";
        block.mine(mockDifficulty, mockMiner);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_INDEX);
    })
   
    test("Should NOT be valid (previousHash)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = "invalid" // invalid previous hash
        block.data = "fakeData";
        block.mine(mockDifficulty, mockMiner);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_PREV_HASH);
    })

    test("Should NOT be valid (hash)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.data = "fakeData";
        block.mine(mockDifficulty, mockMiner);
        block.hash = ""; // invalid hash

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_HASH);
    })

    test("Should create from block info", () =>{

        const block = Block.getFromInfo({
            nextIndex: 1, 
            previousHash: genesis.hash,
            difficulty: mockDifficulty,
            maxDifficulty: 62,
            feePerTx: 1,
            data: "fakeData"
        } as BlockInfo)
        block.mine(mockDifficulty, mockMiner);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })
});