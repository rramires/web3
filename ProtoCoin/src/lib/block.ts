import { SHA256 } from "crypto-js";
import Validation from "./validation";

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

    /** Invalid data */
    static INVALID_DATA: Validation = new Validation(false, "Invalid data.");

    /** No mined */
    static NO_MINED: Validation = new Validation(false, "No mined.");

    /** Invalid index */
    static INVALID_INDEX: Validation = new Validation(false, "Invalid index."); 

    /** Invalid previous hash */
    static INVALID_PREV_HASH: Validation = new Validation(false, "Invalid previous hash."); 

    /** Invalid hash */
    static INVALID_HASH: Validation = new Validation(false, "Invalid hash."); 

    // props
    index: number;
    timestamp: number;
    nonce: number;
    miner: string;
    hash: string;
    previousHash: string;
    data: string;


    /**
     * Creates a new Block
     * @param index number - the block index in blockchain
     * @param previousHash string - the previous block hash
     * @param data string - the block data 
     */
    constructor(index: number, previousHash: string, data: string){
        this.index = index;
        this.timestamp = Date.now();
        this.nonce = 0;
        this.miner = "";
        this.previousHash = previousHash;
        this.data = data;
        // set block hash
        this.hash = this.getHash();
    }

    /**
     * Create the first block
     * @returns Block - return genesis block
     */
    static genesis(): Block{
        const block = new Block(0, "init", "genesis block");
        block.mine(1, "init");
        return block;
    }

    /**
     * Generate and return the block hash
     * @returns string - hash
     */
    getHash():string {
        return SHA256(this.index +
                      this.timestamp +
                      this.nonce +
                      this.miner +
                      this.previousHash +
                      this.data).toString();
    }

    /**
     * Generates zeros according to the difficulty 
     * eg difficulty 4 = 00000
     * @param difficulty number
     * @returns string - prefix, eg: 0000
     */
    getPrefix(difficulty: number): string{
        //return new Array(difficulty + 1).join("0");
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
     * @returns Validation - return if block is valid
     */
    isValid(previousIndex: number, previousHash: string, difficulty: number): Validation{
        // simple checks
        if(this.timestamp < 0) return Block.INVALID_TIMESTAMP;
        if(!this.data) return Block.INVALID_DATA;
        if(!this.nonce || !this.miner) return Block.NO_MINED;
        //
        // checks if the index is the next value in the blockchain
        if((this.index - 1) !== previousIndex) return Block.INVALID_INDEX;
        //
        // checks if the previous hash is the same as the last block
        if(this.previousHash !== previousHash) return Block.INVALID_PREV_HASH;
        //
        // check the hash with the current properties and zeros in the prefix
        const prefix = this.getPrefix(difficulty)
        if(this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return Block.INVALID_HASH;
        //
        // else - success
        return Block.VALID_BLOCK;
    }
}