import TransactionOutput from "../src/lib/transactionOutput";
import Validation from "../src/lib/validation";
import KeyPair from "../src/lib/keyPair";

describe("Transaction Output tests", () => {
    
    let alice: KeyPair;
    let bob: KeyPair;
    const exampleTx: string = "8eba6c75bbd12d9e21f657b76726312aad08f2d3a10aee52d2b1017e6248c186";

    beforeAll(() =>{
        alice = new KeyPair();
        bob = new KeyPair();
    })
    
    test("Should be valid", () =>{
        
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "mockTx"
        } as TransactionOutput);

        const valid: Validation = txOutput.isValid();
        // test
        expect(valid).toEqual(TransactionOutput.VALID_TX_OUTPUT);
    })

    test("Should NOT be valid (negative amount - no params)", () =>{
        
        const txOutput = new TransactionOutput();

        const valid: Validation = txOutput.isValid();
        // test
        expect(valid).toEqual(TransactionOutput.INVALID_NEGATIVE_AMOUNT);
    })

    test("Should NOT be valid (negative amount)", () =>{
        
        const txOutput = new TransactionOutput({
            amount: -1,
            toAddress: alice.publicKey,
            tx: "mockTx"
        } as TransactionOutput);

        const valid: Validation = txOutput.isValid();
        // test
        expect(valid).toEqual(TransactionOutput.INVALID_NEGATIVE_AMOUNT);
    })

    test('Should get hash', () => {
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "mockTx"
        } as TransactionOutput)

        const hash = txOutput.getHash();
        expect(hash).toBeTruthy();
    })
});

