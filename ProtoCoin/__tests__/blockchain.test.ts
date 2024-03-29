import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Validation from "../src/lib/validation";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import KeyPair from "../src/lib/keyPair";
import TransactionOutput from "../src/lib/transactionOutput";


// mocks
jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');


describe("Blockchain tests", () => {

    // mock wallets
    let alice: KeyPair;
    let bob: KeyPair;

    beforeAll(() =>{
        alice = new KeyPair();
        bob = new KeyPair();
    })


    test("Should has genesis block", () =>{
        const blockchain = new Blockchain(alice.publicKey);
        // test
        expect(blockchain.chain.length).toEqual(1);
    })

    test("Should be valid (only genesis)", () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.VALID_BLOCKCHAIN);
    }) 

    test("Should add transaction", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // let's steal the genesis block output transaction 
        const txo = blockchain.chain[0].transactions[0];

        const tx = new Transaction();
        tx.hash = 'tx';
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: txo.hash,
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        // add tx
        const validation: Validation = blockchain.addTransaction(tx);
        // test
        expect(validation).toEqual(Blockchain.TRANSACTION_ADDED);
    })

    test("Should NOT add duplicated transaction", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.hash = "test";
                    
        // add direct to mempool - in this case addTransaction checks for duplicity and and should return error
        blockchain.mempool.push(tx); 
        // add tx
        const validation: Validation = blockchain.addTransaction(tx);
        // test
        expect(validation).toEqual(Blockchain.INVALID_TX_DUPLICATED);
    })

    test("Should NOT add transaction with same wallet in mempool", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // from
        const fromAddress = "02bb0a21ebfeafef1ebcbad6fd5eb359bd6289e0cf9fb0379b013a40bc88b2f26b";

        // create tx1
        const tx1 = new Transaction({
                        txInputs: [new TransactionInput({
                            fromAddress
                        } as TransactionInput)]
                    } as Transaction);
        tx1.hash = "tx1";
        // add direct to mempool 
        blockchain.mempool.push(tx1); 

        // create tx2
        const tx2 = new Transaction({
            txInputs: [new TransactionInput({
                            fromAddress
                        } as TransactionInput)]
        } as Transaction);
        tx2.hash = "tx2";
                    
        // add tx for validation
        const validation: Validation = blockchain.addTransaction(tx2);
        // test
        expect(validation).toEqual(Blockchain.PENDING_TX_SAME_WALLET);
    })

    test('Should NOT add transaction (invalid UTXO)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction();
        tx.hash = 'tx';
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: 'wrong', // invalid
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        const validation = blockchain.addTransaction(tx);
        // test
        expect(validation).toEqual(Blockchain.INVALID_TXO_SPENT_OR_NO_EXISTENT);
    })

    test("Should NOT add invalid transaction", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.hash = "test";
        tx.timestamp = -1; // invalid timestamp

        // add tx
        const validation: Validation = blockchain.addTransaction(tx);
        // test
        expect(validation).toEqual(Blockchain.INVALID_TRANSACTION(Transaction.INVALID_TIMESTAMP.message));
    })

    test("Should get transaction (mempool)", () => {

        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.hash = "test";
        // add tx direct to mempool
        blockchain.mempool.push(tx); // 0 is tx index on memepool

        const result = blockchain.getTransaction(tx.hash);
        expect(result.mempoolIndex).toEqual(0); // 0 index
    })

    test("Should get transaction (blockchain)", () => {

        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        tx.hash = "test";

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        // add block direct to blockchain
        blockchain.chain.push(block); // 1 is the block index in blockchain

        const result = blockchain.getTransaction(tx.hash);
        expect(result.blockIndex).toEqual(1); // 1 index
    })

    test("Should NOT get transaction ", () => {

        const blockchain = new Blockchain(alice.publicKey);

        const result = blockchain.getTransaction("nonExistant ");

        expect(result.blockIndex).toEqual(-1);
        expect(result.mempoolIndex).toEqual(-1);
    })
    
    test("Should add block", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        // add to mempool
        blockchain.mempool.push(tx);  

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        //
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.BLOCK_ADDED);
    })

    test("Should NOT add block (no next block)", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        
        // NOT add to mempool
        // **** 

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        //
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.INVALID_NO_NEXT_BLOCK);
    })

    test("Should NOT add block (mempool length)", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // added direct transactions to force invalid mempool length
        blockchain.mempool.push(new Transaction());
        blockchain.mempool.push(new Transaction());

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        // add to mempool
        blockchain.mempool.push(tx);  

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        //
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK(Blockchain.INVALID_TXS_LENGTH.message));
    })

    /* test("Should NOT add block (mempool length)", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
                        txInputs: [new TransactionInput()]
                    } as Transaction);
        
        // NOT add to mempool
        // **** 

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        //
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK(Blockchain.INVALID_TXS_LENGTH.message));
    }) */

    test("Should NOT add block", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
            txInputs: [new TransactionInput()]
        } as Transaction);
        // add to mempool
        blockchain.mempool.push(tx); 

        // add INVALID block
        const block = new Block();
        block.index = -1; // invalid index
        block.previousHash = "invalid";
        block.transactions = [tx];
        //
        const validation: Validation = blockchain.addBlock(block);
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK(Block.INVALID_BLOCK.message));
    }) 

    test("Should get block", () =>{
        const blockchain = new Blockchain(alice.publicKey);
        // get block
        const block = blockchain.getBlock(blockchain.chain[0].hash)
        // test
        expect(block).toBeTruthy();
    })

    test("Should be valid (two blocks)", () =>{
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
            txInputs: [new TransactionInput()]
        } as Transaction);
        // add to mempool
        blockchain.mempool.push(tx); 

        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];
        //
        blockchain.addBlock(block);
        //
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.VALID_BLOCKCHAIN);
    })

    test("Should be INVALID (two blocks)", () =>{
        const invalidIndex: number = -1
        const blockchain = new Blockchain(alice.publicKey);

        // create tx
        const tx = new Transaction({
            txInputs: [new TransactionInput()]
        } as Transaction);
        // add to mempool
        blockchain.mempool.push(tx); 
        
        // add block
        const block = new Block();
        block.index = 1
        block.previousHash = blockchain.chain[0].hash;
        block.transactions = [tx];

        blockchain.addBlock(block);
        blockchain.chain[1].index = invalidIndex; // invalidate index
        
        const validation: Validation = blockchain.isValid();
        // test
        expect(validation).toEqual(Blockchain.INVALID_BLOCK_NO(invalidIndex, Block.INVALID_BLOCK.message));
    })

    test("Should get next block info", () =>{
        const blockchain = new Blockchain(alice.publicKey);
        // add transaction
        blockchain.mempool.push(new Transaction());
        // get block
        const blockInfo = blockchain.getNextBlock();
        // test
        expect(blockInfo).toBeTruthy();
        expect(blockInfo ? blockInfo.nextIndex : 0).toEqual(1);
    })

    test("Should NOT get next block info", () =>{
        const blockchain = new Blockchain(alice.publicKey);
        // get block
        const blockInfo = blockchain.getNextBlock();
        // test
        expect(blockInfo).toBeNull();
    })

    test('Should get balance', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const balance = blockchain.getBalance(alice.publicKey);
        expect(balance).toBeGreaterThan(0);
    })

    test('Should get zero balance', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const balance = blockchain.getBalance(bob.publicKey);
        expect(balance).toEqual(0);
    })

    test('Should get UTXO', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.chain[0].transactions[0];

        const tx = new Transaction();
        tx.hash = 'tx';
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: txo.hash,
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [
            new TransactionOutput({
                amount: 5,
                toAddress: 'abc'
            } as TransactionOutput),
            new TransactionOutput({
                amount: 4,
                toAddress: alice.publicKey
            } as TransactionOutput)
        ]

        blockchain.chain.push(new Block({
            index: 1,
            transactions: [tx]
        } as Block))

        const utxo = blockchain.getUtxo(alice.publicKey)
        expect(utxo.length).toBeGreaterThan(0);
    })
});