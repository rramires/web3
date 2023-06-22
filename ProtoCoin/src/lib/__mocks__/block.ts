import Validation from "../validation";

/**
 * Block class
 */
export default class Block{
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
       return new Block(0, "init", "genesis block");
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
        if( this.index < 0 || previousIndex < 0 || !previousHash) return new Validation(false, "Invalid mock block."); 
        return new Validation();
    }
}