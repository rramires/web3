import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";
import Validation from "../src/lib/validation";
import KeyPair from "../src/lib/keyPair";

// mocks
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe("Block tests", () => {

    // mock wallets
    let alice: KeyPair;
    let bob: KeyPair;

    beforeAll(() => {
        alice = new KeyPair();
        bob = new KeyPair();
    })


    test("Should be valid (no params)", () =>{

        const tx = new Transaction();
              tx.txInputs = [new TransactionInput()]
              tx.txOutputs = [new TransactionOutput({
                toAddress: alice.publicKey
              } as TransactionOutput)]
              tx.hash = tx.getHash();
              tx.txOutputs[0].tx = tx.hash;

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should be valid (with params)", () =>{

        const tx = new Transaction({
                        type: TransactionType.FEE,
                        txInputs: [new TransactionInput()],
                        txOutputs: [new TransactionOutput({
                            toAddress: alice.publicKey
                          } as TransactionOutput)]
                    } as Transaction);
        // test getHash empty txInputs 
        tx.txInputs = undefined; // -> const from = this.txInputs ? this.txInputs.getHash() : "";
        tx.hash = tx.getHash();
        tx.txOutputs[0].tx = tx.hash;

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.VALID_TRANSACTION);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.timestamp = -1 // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TIMESTAMP);
    })

    test("Should NOT be valid (txInput)", () =>{

        const tx = new Transaction({
                        txInputs: [new TransactionInput()],
                        txOutputs: [new TransactionOutput({
                            toAddress: alice.publicKey
                          } as TransactionOutput)]
                    } as Transaction);

        if(tx.txInputs !== undefined){
            tx.txInputs[0].amount = -1 // invalid
        }

        //
        
        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_INPUT_TX(TransactionInput.INVALID_AMOUNT.message));
    }) 
    
    test("Should NOT be valid (hash)", () =>{

        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.hash = "invalid"; // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_HASH);
    })

    test("Should NOT be valid (TXO reference hash)", () =>{

        const tx = new Transaction();
              tx.txInputs = [new TransactionInput()]
              tx.txOutputs = [new TransactionOutput({
                toAddress: alice.publicKey
              } as TransactionOutput)]
              tx.hash = tx.getHash();
              tx.txOutputs[0].tx = "invalidHash"; // invalid

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TXO_REF_HASH);
    })

    test("Should NOT be valid (Invalid TX output)", () =>{

        const tx = new Transaction();
              tx.txInputs = [new TransactionInput({
            } as TransactionInput)]
              // invalid NO tx.txOutputs
              tx.hash = tx.getHash();

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TXO);
    })

    test("Should NOT be valid (inputs < outputs)", () =>{

        const tx = new Transaction();
              tx.txInputs = [new TransactionInput({
                amount: 1 // input value
            } as TransactionInput)]
              tx.txOutputs = [new TransactionOutput({
                amount: 2, // invalid - higher output value
                toAddress: alice.publicKey
              } as TransactionOutput)]
              tx.hash = tx.getHash();
              tx.txOutputs[0].tx = tx.hash;

        const valid: Validation = tx.isValid();
        // test
        expect(valid).toEqual(Transaction.INVALID_TXO_GREATER);
    })
});