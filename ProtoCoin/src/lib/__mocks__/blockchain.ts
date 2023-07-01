import Block from "./block"; // mock
import Transaction from "./transaction"; // mock
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import TransactionSearch from "../transactionSearch";


/**
 * Mocked Blockchain class
 */
export default class Blockchain {

    /** Block added. */
    static BLOCK_ADDED: Validation = new Validation(true, "Block added.");

    /** Valid blockchain. */
    static VALID_BLOCKCHAIN: Validation = new Validation(true, "Valid blockchain.");

    /** Transaction added. */
    static TRANSACTION_ADDED: Validation = new Validation(true, "Transaction added.");

    /** Invalid transaction {msg} */
    static INVALID_TRANSACTION(msg: string): Validation{
        return new Validation(false, `Invalid transaction: ${msg}`);
    }
    
    //
    chain: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    /**
     * Creates a new mocked Blockchain
     */
    constructor(){
        // initiate array with the genesis block
        this.chain = [Block.genesis()];
        this.mempool = [];
        this.nextIndex++;
    }

    /**
     * Return last block on blockchain
     * @returns Block - return last block
     */
    getLastBlock(): Block{
        return this.chain[this.chain.length -1];
    }


    /**
     * Add a transaction to the mempool
     */
    addTransaction(transaction: Transaction): Validation{
        // verify
        const validation = transaction.isValid();
        if(!validation.success) return Blockchain.INVALID_TRANSACTION(validation.message);
        //
        // add transaction 
        this.mempool.push(transaction);
        return Blockchain.TRANSACTION_ADDED;
    }

    /**
     * Add block on chain
     */
    addBlock(block: Block): Validation{
        // fake error
        if(block.index < 0) return Block.INVALID_BLOCK;
        // add
        this.chain.push(block);
        this.nextIndex++;
        return Blockchain.BLOCK_ADDED;
    }


    /**
     * Return block by hash
     * @returns TransactionSearch - return trasaction with mempool or block index
     */
    getTransaction(hash: string): TransactionSearch {
        // skip
        if (hash === "-1") return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch;
        //
        return {
            mempoolIndex: 0,
            transaction: new Transaction()
        } as TransactionSearch;
    }

    /**
     * Return block by hash
     * @returns Block - return block
     */
    getBlock(hash: string): Block | undefined{
        return this.chain.find(b => b.hash === hash);
    }

    /**
     * Validate this blockchain
     * @returns Validation - return if chain is valid
     */
    isValid(): Validation{
        // always valid
        return Blockchain.VALID_BLOCKCHAIN;
    }

    getFeePerTx(): number{
        return 1;
    }

    getNextBlock(): BlockInfo{
        return {
            nextIndex: this.chain.length,
            previousHash: this.getLastBlock().hash,
            difficulty: 1,
            maxDifficulty: 62,
            feePerTx: this.getFeePerTx(),
            transactions: [new Transaction()]
        } as BlockInfo
    }
}