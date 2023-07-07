import Transaction from "./transaction"; // mock
import Validation from "../validation";
import TransactionType from "../transactionType";

/**
 * Block class
 */
export default class Block{

    /** Valid block. */
    static VALID_BLOCK: Validation = new Validation(true, "Valid block.");

    /** Invalid block. */
    static INVALID_BLOCK: Validation = new Validation(false, "Invalid block.");


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
        this.transactions = block?.transactions || [] as Transaction[];
        this.hash = this.getHash();
    }

    /**
     * Create the first block
     * @returns Block - return genesis block
     */
    static genesis(): Block{
        const block = new Block();
        const tx: Transaction = new Transaction();
              tx.type = TransactionType.FEE;
              tx.txOutputs = "It's the genesis block! ;-)";
        block.transactions = [tx];
        block.previousHash = "00000";
        //block.mine(1, "its-genesis");
        return block;
    }

    /**
     * Generate and return the block hash
     * @returns string - hash
     */
    getHash():string {
        return this.hash || "mockHash";
    }

    /**
     * Validates the Block
     * @param previousIndex number - last block index
     * @param previousHash string - last block hash
     * @returns Validation - return if block is valid
     */
    isValid(previousIndex: number, previousHash: string): Validation{
        // simple validation mock
        if(this.index < 0 || previousIndex < 0 || !previousHash) return Block.INVALID_BLOCK; 
        // esle
        return Block.VALID_BLOCK;
    }
}