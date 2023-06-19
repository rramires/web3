import Block from "./block";
import Validation from "./validation";

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
    addBlock(block: Block): Validation{
        // 
        const lastBlock = this.getLastBlock();
        // verify
        const validation = block.isValid(lastBlock.index, lastBlock.hash)
        if(!validation.success) return new Validation(false, `Invalid block: ${validation.message}`);
        // add
        this.chain.push(block);
        this.nextIndex++;
        return new Validation();
    }

    /**
     * Return block by hash
     * @returns Block - return block
     */
    getBlock(hash: string): Block | undefined{
        return this.chain.find(b => b.hash == hash);
    }

    /**
     * Validate this blockchain
     * @returns Validation - return if chain is valid
     */
    isValid(): Validation{
        // check the entire blockchain from the last to the first block
        for(let i: number = this.chain.length -1 ; i > 0 ; i--){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // compare the current with the previous
            const validation: Validation = currentBlock.isValid(previousBlock.index, previousBlock.hash)
            // returns block number and error message found
            if(!validation.success) return new Validation(false, `Block No ${currentBlock.index}: ${validation.message}`);
        }   
        return new Validation();
    }
}