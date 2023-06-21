import Block from "./block";
import Validation from "../validation";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    //
    chain: Block[];
    nextIndex: number = 0;

    /**
     * Creates a new mocked Blockchain
     */
    constructor(){
        // initiate array with the genesis block
        this.chain = [Block.genesis()];
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
     * Add block on chain
     */
    addBlock(block: Block): Validation{
        // fake error
        if(block.index < 0) return new Validation(false, "Invalid blockchain mock");
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
        return this.chain.find(b => b.hash === hash);
    }

    /**
     * Validate this blockchain
     * @returns Validation - return if chain is valid
     */
    isValid(): Validation{
        // always valid
        return new Validation();
    }
}