import Transaction from "../src/lib/transaction";
import Validation from "../src/lib/validation";

describe("Block tests", () => {
    //
    test("Should be valid (no params)", () =>{

        const tx = new Transaction();
              tx.data = "Tx 1";
              tx.hash = tx.getHash();

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should be valid (with params)", () =>{

        const tx = new Transaction({
                        data: "Tx 1"
                    } as Transaction);

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const tx = new Transaction({
                        data: "Tx 1"
                    } as Transaction);
        tx.timestamp = -1 // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TIMESTAMP);
    })

    test("Should NOT be valid (data)", () =>{

        const tx = new Transaction({
                        data: "Tx 1"
                    } as Transaction);
        tx.data = ""; // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_DATA);
    })
    
    test("Should NOT be valid (hash)", () =>{

        const tx = new Transaction({
                        data: "Tx 1"
                    } as Transaction);
        tx.hash = "invalid"; // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_HASH);
    })
});