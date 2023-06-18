import Block from "../src/lib/block";

describe("Block tests", () => {

    test("Should be valid", () =>{

        const block = new Block(1, "fakePrevHash", "fakeData");
        const valid = block.isValid();
        // test
        expect(valid).toBeTruthy();
    })


    test("Should NOT be valid (index)", () =>{

        const block = new Block(-1, "fakePrevHash", "fakeData");
        const valid = block.isValid();
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = new Block(1, "fakePrevHash", "fakeData");
        block.timestamp = 0; // invalid timestamp
        const valid = block.isValid();
        // test
        expect(valid).toBeFalsy();
    })
    
    test("Should NOT be valid (previousHash)", () =>{

        const block = new Block(1, "", "fakeData");
        const valid = block.isValid();
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (data)", () =>{

        const block = new Block(1, "fakePrevHash", "");
        const valid = block.isValid();
        // test
        expect(valid).toBeFalsy();
    })

    test("Should NOT be valid (hash)", () =>{

        const block = new Block(1, "fakePrevHash", "fakeData");
        block.hash = ""; // invalid hash
        const valid = block.isValid();
        // test
        expect(valid).toBeFalsy();
    })
});