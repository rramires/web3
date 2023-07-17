import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import KeyPair from "../src/lib/keyPair";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";
import TransactionType from "../src/lib/transactionType";
import Validation from "../src/lib/validation";

// mocks
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');


describe("Block tests", () => {

    // mock wallets
    let alice: KeyPair;

    beforeAll(() =>{
        alice = new KeyPair();
    })

    //
    const mockDifficulty = 1;

    let genesis: Block;
    beforeAll(() =>{
        genesis = Block.genesis(alice.publicKey);
    })

   test("Should be valid", () =>{

        const block = new Block({index: 1,
                                 previousHash: genesis.hash,
                                 transactions: [new Transaction({
                                    txInputs: [new TransactionInput()]
                                 } as Transaction)]} as Block); // this params test constructor

        // fee transaction
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)]
        } as Transaction));

        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })

    test("Should NOT be valid (no fee)", () =>{

        const block = new Block({index: 1,
                                 previousHash: genesis.hash,
                                 transactions: [new Transaction({
                                    txInputs: [new TransactionInput()]
                                 } as Transaction)]} as Block); // this params test constructor

        // NO fee transaction

        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.NO_FEE_TX);
    })

    test("Should be valid (invalid miner in fee tx)", () =>{

        const block = new Block({index: 1,
                                 previousHash: genesis.hash,
                                 transactions: [new Transaction({
                                    txInputs: [new TransactionInput()]
                                 } as Transaction)]} as Block); // this params test constructor

        // fee transaction
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()]
        } as Transaction));

        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.FEE_TX_ISNT_MINER);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.transactions = [new Transaction({
                                    txInputs: [new TransactionInput()]
                                } as Transaction)];

        block.mine(mockDifficulty, alice.publicKey);

        block.timestamp = -1; // invalid timestamp
        block.hash = block.getHash(); // update hash with new timestamp

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_TIMESTAMP);
    })

    test("Should NOT be valid (transactions)", () =>{

        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.timestamp = -1; // invalid

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.transactions = [tx];

        // fee transaction
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)]
        } as Transaction));

        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_TX_IN_BLOCK(Transaction.INVALID_TIMESTAMP.message));
    }) 

    test("Should NOT be valid (double transaction fee)", () =>{

        const tx1 = new Transaction({
                        txInputs: [new TransactionInput()],
                        type: TransactionType.FEE
                    } as Transaction);

        const tx2 = new Transaction({
                        txInputs: [new TransactionInput()],
                        type: TransactionType.FEE
                    } as Transaction);

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.transactions = [tx1, tx2];
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.TX_TOO_MANY_FEES);
    })

    test("Should NOT be mined", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.transactions = [new Transaction({
                                    txInputs: [new TransactionInput()]
                                } as Transaction)];
        block.nonce = -1; // invalid nonce 

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.NO_MINED);
    })

    test("Should NOT be valid (index)", () =>{

        const block = new Block();
        block.index = -1 // invalid index
        block.previousHash = genesis.hash;
        block.transactions = [new Transaction({
                                    txInputs: [new TransactionInput()]
                                } as Transaction)];
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_INDEX);
    })
   
    test("Should NOT be valid (previousHash)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = "invalid" // invalid previous hash
        block.transactions = [new Transaction({
                                    txInputs: [new TransactionInput()]
                                } as Transaction)];
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.INVALID_PREV_HASH);
    })

    test("Should NOT be valid (hash)", () =>{

        const block = new Block();
        block.index = 1
        block.previousHash = genesis.hash;
        block.transactions = [new Transaction({
                                    txInputs: [new TransactionInput()]
                                } as Transaction)];
        block.mine(mockDifficulty, alice.publicKey);
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
            transactions: [new Transaction({
                                txInputs: [new TransactionInput()]
                            } as Transaction)]
        } as BlockInfo)

        // fee transaction
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)]
        } as Transaction));

        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })
});