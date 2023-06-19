import { SHA256 } from "crypto-js";

/**
 * Block class
 */
export default class Block{
    index: number;
    timestamp: number;
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
        this.previousHash = previousHash;
        this.data = data;
        // set block hash
        this.hash = this.getHash();
    }

    /**
     * Create the first block
     * @returns {Block} - return genesis block
     */
    static genesis(): Block{
       return new Block(0, "init", "genesis block");
    }

    /**
     * Generate and return the block hash
     * @returns {string} - hash
     */
    getHash():string {
        return SHA256(this.index +
                      this.timestamp +
                      this.previousHash +
                      this.data).toString();
    }

    /**
     * Validates the Block
     * @param previousIndex number - last block index
     * @param previousHash string - last block hash
     * @returns boolean - return if block is valid
     */
    isValid(previousIndex: number, previousHash: string): boolean{
        // checks if the index is the next value in the blockchain
        if((this.index - 1) !== previousIndex) return false; 
        // checks if the previous hash is the same as the last block
        if(this.previousHash !== previousHash) return false;
        // check hash with all current properties data
        if(this.hash !== this.getHash()) return false;
        // others simple checks
        if(this.timestamp < 1) return false; 
        if(!this.data) return false;
        return true;
    }
}