import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionType from "../src/lib/transactionType";
import Validation from "../src/lib/validation";

// mocks
jest.mock('../src/lib/transactionInput');


describe("Block tests", () => {
    //
    test("Should be valid (no params)", () =>{

        const tx = new Transaction();
              tx.txInputs = new TransactionInput()
              tx.hash = tx.getHash();

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should be valid (with params)", () =>{

        const tx = new Transaction({
                        txInputs: new TransactionInput(),
                        type: TransactionType.FEE
                    } as Transaction);
        // test getHash empty txInputs 
        tx.txInputs = undefined; // -> const from = this.txInputs ? this.txInputs.getHash() : "";
        tx.hash = tx.getHash();

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const tx = new Transaction({
                        txInputs: new TransactionInput()
                    } as Transaction);
        tx.timestamp = -1 // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TIMESTAMP);
    })

    test("Should NOT be valid (txInput)", () =>{

        const tx = new Transaction({
                        txInputs: new TransactionInput()
                    } as Transaction);
        if(tx.txInputs !== undefined){
            tx.txInputs.amount = -1 // invalid
        }
        
        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_INPUT_TX(TransactionInput.INVALID_AMOUNT.message));
    }) 
    
    test("Should NOT be valid (hash)", () =>{

        const tx = new Transaction({
                        txInputs: new TransactionInput()
                    } as Transaction);
        tx.hash = "invalid"; // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_HASH);
    })
});