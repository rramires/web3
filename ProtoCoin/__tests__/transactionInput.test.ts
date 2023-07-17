import TransactionInput from "../src/lib/transactionInput";
import Validation from "../src/lib/validation";
import KeyPair from "../src/lib/keyPair";

describe("Transaction Input tests", () => {
    
    let alice: KeyPair;
    let bob: KeyPair;
    const exampleTx: string = "8eba6c75bbd12d9e21f657b76726312aad08f2d3a10aee52d2b1017e6248c186";

    beforeAll(() =>{
        alice = new KeyPair();
        bob = new KeyPair();
    })
    
    test("Should be valid", () =>{
        
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "mockTx"
        } as TransactionInput);
        txInput.sign(alice.privateKey);

        const valid: Validation = txInput.isValid();
        // test
        expect(valid).toEqual(TransactionInput.VALID_TX_INPUT);
    })

    test('Should NOT be valid (signature required)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput)
        // *** txInput.sign(alice.privateKey); // not sign

        const valid = txInput.isValid()
        // test
        expect(valid).toEqual(TransactionInput.PREV_TX_SIGNATURE_REQUIRED);
    })

    test('Should NOT be valid (invalid amount)', () => {
        const txInput = new TransactionInput({
            amount: -10, // invalid
            fromAddress: alice.publicKey,
            previousTx: "mockTx"
        } as TransactionInput)
        txInput.sign(alice.privateKey); // not sign

        const valid = txInput.isValid();
        // test
        expect(valid).toEqual(TransactionInput.INVALID_AMOUNT);
    })


    test('Should NOT be valid (invalid amount - constructor defaults)', () => {
        const txInput = new TransactionInput();
        txInput.sign(alice.privateKey);
        txInput.previousTx = "mockTx"

        const valid = txInput.isValid();
        // test
        expect(valid).toEqual(TransactionInput.INVALID_AMOUNT);
    })


    test('Should NOT be valid (invalid signature)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "mockTx"
        } as TransactionInput);
        txInput.sign(bob.privateKey); // invalid - sign with bob

        const valid = txInput.isValid();
        // test
        expect(valid).toEqual(TransactionInput.INVALID_TX_SIGNATURE);
    })
});

