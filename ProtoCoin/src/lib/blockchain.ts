import Block from "./block";

/**
 * Blockchain class
 */
export default class Blockchain {
    //
    chain: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new Blockchain
     */
    constructor(){
        // initiate array with the genesis block
        this.chain = [Block.genesis()];
        this.nextIndex++;
        // 
        console.log('The blockchain starts with: ', this.chain);
    }

    /**
     * Return last block on blockchain
     * @returns Block - return last block
     */
    getLastBlock(): Block{
        return this.chain[this.chain.length -1];
    }

    /**
     * Add block on chain
     */
    addBlock(block: Block): boolean{
        // verify
        const lastBlock = this.getLastBlock();
        if(!block.isValid(lastBlock.index, lastBlock.hash)) return false;
        // add
        this.chain.push(block);
        this.nextIndex++;
        return true;
    }

    /**
     * Validate this blockchain
     * @returns boolean - return true if chain is valid
     */
    isValid(): boolean{
        // check the entire blockchain from the last to the first block
        for(let i: number = this.chain.length -1 ; i > 0 ; i--){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // compare the current with the previous
            if(!currentBlock.isValid(previousBlock.index, previousBlock.hash)) return false;
        }   
        return true;
    }
}