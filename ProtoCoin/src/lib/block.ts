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
     * Generate and return the block hash
     * @returns string - hash
     */
    getHash():string {
        return SHA256(this.index +
                      this.timestamp +
                      this.previousHash +
                      this.data).toString();
    }

    /**
     * Validates the Block
     * @returns boolean - return if block is valid
     */
    isValid(): boolean{
        if(this.index < 0) return false; 
        if(this.timestamp < 1) return false; 
        if(!this.previousHash) return false;
        if(!this.data) return false;
        if(!this.hash) return false;
        return true;
    }
}