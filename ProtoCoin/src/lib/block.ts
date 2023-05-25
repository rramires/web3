/**
 * Block class
 */
export default class Block{
    index: number = 0;
    hash: string = "";

    /**
     * Creates a new Block
     * @param index number - the block index in blockchain
     * @param hash string - the block hash
     */
    constructor(index: number, hash: string){
        this.index = index;
        this.hash = hash;
    }

    /**
     * Validates the Block
     * @returns boolean - return if block is valid
     */
    isValid(): boolean{
        if(this.index < 0) return false; 
        if(!this.hash) return false;
        return true;
    }
}