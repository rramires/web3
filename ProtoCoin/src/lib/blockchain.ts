import Block from "./block";

/**
 * Blockchain class
 */
export default class Blockchain {
    //
    blocks: Block[];

    /**
     * Creates a new Blockchain
     */
    constructor(){
        this.blocks = [new Block(0, "", "genesis block")];
    }
}