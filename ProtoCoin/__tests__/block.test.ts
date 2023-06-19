import Block from "../src/lib/block";

describe("Block tests", () => {

    let genesis: Block;
    beforeAll(() =>{
        genesis = Block.genesis();
    })

    test("Should be valid", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeTruthy();
    })


    test("Should NOT be valid (index)", () =>{

        const block = new Block(-1, genesis.hash, "fakeData");
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
        block.timestamp = 0; // invalid timestamp
        block.hash = block.getHash(); // update hash with neu timestamp
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeFalsy();
    })
    
    test("Should NOT be valid (previousHash)", () =>{

        const block = new Block(1, "invalidHash", "fakeData");
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (data)", () =>{

        const block = new Block(1, genesis.hash, "");
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (hash)", () =>{

        const block = new Block(1, genesis.hash, "fakeData");
        block.hash = ""; // invalid hash
        const valid = block.isValid(genesis.index, genesis.hash);
        // test
        expect(valid).toBeFalsy();
    })
});