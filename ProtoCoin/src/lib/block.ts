import { SHA256 } from "crypto-js";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import Blockchain from "./blockchain";
import TransactionOutput from "./transactionOutput";

/**
 * Block class
 */
export default class Block{

    // messages

    /** Valid block. */
    static VALID_BLOCK: Validation = new Validation(true, "Valid block.");

    /** Invalid block. */
    static INVALID_BLOCK: Validation = new Validation(false, "Invalid block.");

    /** Invalid timestamp */
    static INVALID_TIMESTAMP: Validation = new Validation(false, "Invalid timestamp.");

    /** No mined */
    static NO_MINED: Validation = new Validation(false, "No mined.");

    /** Invalid index */
    static INVALID_INDEX: Validation = new Validation(false, "Invalid index."); 

    /** Invalid previous hash */
    static INVALID_PREV_HASH: Validation = new Validation(false, "Invalid previous hash."); 

    /** Invalid hash */
    static INVALID_HASH: Validation = new Validation(false, "Invalid hash."); 

    /** Invalid transactions - No fee transaction. */
    static NO_FEE_TX: Validation = new Validation(false, "No fee transaction.");

    /** Invalid transactions - too many fees */
    static TX_TOO_MANY_FEES: Validation = new Validation(false, "Invalid Tx. There is more than one fee in this block.");

    /** Invalid transactions - Fee tx is not miner. */
    static FEE_TX_ISNT_MINER: Validation = new Validation(false, "Fee tx is not miner.");


    /** Invalid transaction in this block: {msg} */
    static INVALID_TX_IN_BLOCK(msg: string): Validation{
        return new Validation(false, `Invalid transaction in this block: ${msg}`);
    }

    // props
    index: number;
    timestamp: number;
    nonce: number;
    miner: string;
    hash: string;
    previousHash: string;
    transactions: Transaction[];


    /**
     * Creates a new Block
     * @param block - Block optional
     */
    constructor(block?: Block){
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.previousHash = block?.previousHash || "";
        //        
        // map converts each object passed as a parameter into a Transaction
        this.transactions = block?.transactions && block.transactions.length > 0 ? 
                            block.transactions.map(tx => new Transaction(tx)) : 
                            [] as Transaction[]; 
        //      
        this.hash = this.getHash();
    }

    /**
     * Return block from blockinfo 
     * @returns Block 
     */
    static getFromInfo(blockInfo: BlockInfo): Block{
        const block = new Block();
              block.index = blockInfo.nextIndex;
              block.previousHash = blockInfo.previousHash;
              block.transactions = blockInfo.transactions.map(tx => new Transaction(tx));
        return block;
    }

    /**
     * Generate and return the block hash
     * @returns string - hash
     */
    getHash():string {
        // concatenates all transaction hashes
        const txsHashes = this.transactions && this.transactions.length ? 
                          this.transactions.map(tx => tx.hash).reduce((prev, curr) => prev + curr) : 
                          "";
        return SHA256(this.index +
                      this.timestamp +
                      this.nonce +
                      this.miner +
                      this.previousHash +
                      txsHashes).toString();
    }

    /**
     * Generates zeros according to the difficulty 
     * eg difficulty 4 = 00000
     * @param difficulty number
     * @returns string - prefix, eg: 0000
     */
    getPrefix(difficulty: number): string{
        return '0'.repeat(difficulty);
    }

    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty The blockchain current difficulty
     * @param miner The miner wallet address
     */
    mine(difficulty: number, miner: string){
        //
        this.miner = miner;
        const prefix = this.getPrefix(difficulty);
        // bruteforce loop 
        do{
            // increment nonce
            this.nonce++;
            // generate hash
            this.hash = this.getHash();
        }
        // compare with prefix length and stop loop when match
        while(!this.hash.startsWith(prefix));
    }

    /**
     * Validates the Block
     * @param previousIndex number - last block index
     * @param previousHash string - last block hash
     * @param difficulty number - current difficulty
     * @param feePerTx number - fees per transaction
     * @returns Validation - return if block is valid
     */
    isValid(previousIndex: number, previousHash: string, difficulty: number, feePerTx: number): Validation{
        // simple checks
        if(this.timestamp < 0) return Block.INVALID_TIMESTAMP;
        if(this.nonce < 1 || !this.miner) return Block.NO_MINED;
        //
        // checks if the index is the next value in the blockchain
        //console.log("this.index: ",  this.index, "previousIndex: ", previousIndex);
        if((this.index - 1) !== previousIndex) return Block.INVALID_INDEX;
        //
        // checks if the previous hash is the same as the last block
        if(this.previousHash !== previousHash) return Block.INVALID_PREV_HASH;
        //
        // check the hash with the current properties and zeros in the prefix
        const prefix = this.getPrefix(difficulty)
        if(this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return Block.INVALID_HASH;
        //
        // check transactions
        if(this.transactions && this.transactions.length){
            // get fee txs
            const feeTxs = this.transactions.filter(tx => tx.type === TransactionType.FEE);
            // check if there is Fee transaction
            if(feeTxs.length === 0) return Block.NO_FEE_TX;
            // checks if there is more than one fee-type transaction
            if(feeTxs.length > 1) return Block.TX_TOO_MANY_FEES;
            // check if the miner will receive the reward 
            if (!feeTxs[0].txOutputs.some(txo => txo.toAddress === this.miner)) return Block.FEE_TX_ISNT_MINER;
            //
            // calculate the amount of fees (filter exclude fee txs) 
            const totalFees = feePerTx * this.transactions.filter(tx => tx.type !== TransactionType.FEE).length;
            // check if there are any invalid transactions
            const validations = this.transactions.map(tx => tx.isValid(difficulty, totalFees)); // check all tx and get validations array
            const errors = validations.filter(v => !v.success).map(v => v.message); // filter invalids
            if (errors.length > 0) {
                const errorsMessage = errors.reduce((prev, curr) => prev + curr); // concat errors
                return Block.INVALID_TX_IN_BLOCK(errorsMessage);
            }
        }  
        //
        // else - success
        return Block.VALID_BLOCK;
    }
}