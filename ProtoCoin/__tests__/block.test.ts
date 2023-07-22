import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Blockchain from "../src/lib/blockchain";
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

    // mocks
    let alice: KeyPair;
    let bob: KeyPair;
    // 
    let genesis: Block;

    const mockDifficulty: number = 1;
    const mockFee: number = 1;
    const mockTx: string = "8eba6c75bbd12d9e21f657b76726312aad08f2d3a10aee52d2b1017e6248c186";
    

    beforeAll(() =>{
        // wallets
        alice = new KeyPair();
        bob = new KeyPair();
        // genesis block
        genesis = new Block({
            transactions: [new Transaction({
                txInputs: [new TransactionInput()]
            } as Transaction)]
        } as Block);
    })


    function getFullBlock(): Block{
        // in alice
        const txIn = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: mockTx
        } as TransactionInput)
        txIn.sign(alice.privateKey);
        // out bob
        const txOut = new TransactionOutput({
            amount: 10,
            toAddress: bob.publicKey
        } as TransactionOutput);
        // create tx
        const tx = new Transaction({
            txInputs: [txIn],
            txOutputs: [txOut]
        } as Transaction)
        // add fee tx
        const txFee = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                amount: 1,
                toAddress: alice.publicKey
            } as TransactionOutput)]
        } as Transaction);
        // add to block
        const block = new Block({
            index: 1,
            transactions: [tx, txFee],
            previousHash: genesis.hash
        } as Block)
        // mine
        block.mine(mockDifficulty, alice.publicKey);
        //
        return block;
    }


   test("Should be valid", () =>{

        const block = getFullBlock();

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })

    test("Should NOT be valid (hash)", () =>{

        const block = getFullBlock();

        // invalidate
        block.hash = "invalid";

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.INVALID_HASH);
    })

    test("Should NOT be valid (no fee)", () =>{

        const block = new Block({index: 1,
                                 previousHash: genesis.hash,
                                 transactions: [new Transaction({
                                    txInputs: [new TransactionInput()]
                                 } as Transaction)]} as Block); // this params test constructor

        // NO fee transaction

        // hash
        block.hash = block.getHash();
        // mine 
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.NO_FEE_TX);
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

        // hash
        block.hash = block.getHash();
        // mine
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.VALID_BLOCK);
    })

    test("Should NOT be valid (double transaction fee)", () =>{

        const block = getFullBlock()

        const txFee2 = new Transaction({
                        txInputs: undefined,
                        txOutputs: [new TransactionOutput()],
                        type: TransactionType.FEE
                    } as Transaction);

        // invalidate
        block.transactions.push(txFee2); // invalid second fee tx

        // hash
        block.hash = block.getHash();
        // mine 
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.TX_TOO_MANY_FEES);
    })

    test("Should NOT be valid (previousHash)", () =>{

        const block = getFullBlock()

        // invalidate
        block.previousHash = "invalid" // invalid previous hash

        // hash
        block.hash = block.getHash(); 
        // mine 
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.INVALID_PREV_HASH);
    })

    test("Should NOT be valid (timestamp)", () =>{

        const block = getFullBlock()

        block.timestamp = -1; // invalid timestamp

        // hash
        block.hash = block.getHash(); 
        // mine 
        block.mine(mockDifficulty, alice.publicKey);

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.INVALID_TIMESTAMP);
    })

    test("Should NOT be mined", () =>{

        const block = getFullBlock();

        // invalidate
        block.nonce = -1; // invalid nonce 

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.NO_MINED);
    })

    test("Should NOT be valid (index)", () =>{

        const block = getFullBlock()

        // invalidate
        block.index = -1;

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.INVALID_INDEX);
    })

    test("Should NOT be valid (transactions)", () =>{

        const block = getFullBlock();
        
        // invalidate
        block.transactions[0].timestamp = -1; // invalid

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.INVALID_TX_IN_BLOCK(Transaction.INVALID_TIMESTAMP.message));
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

        const valid: Validation = block.isValid(genesis.index, genesis.hash, mockDifficulty, mockFee);
        // test
        expect(valid).toEqual(Block.FEE_TX_ISNT_MINER);
    })
});