import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";

/**
 * Blockchain class
 */
export default class Blockchain {

    // messages

    /** Block added. */
    static BLOCK_ADDED: Validation = new Validation(true, "Block added.");

    /** Valid blockchain. */
    static VALID_BLOCKCHAIN: Validation = new Validation(true, "Valid blockchain.");

    /** Invalid block {msg} */
    static INVALID_BLOCK(msg: string): Validation{
        return new Validation(false, `Invalid block: ${msg}`);
    }

    /** Invalid block No {X}: {msg} */
    static INVALID_BLOCK_NO(no: number, msg: string): Validation{
        return new Validation(false, `Block No ${no}: ${msg}`);
    }

    // props
    chain: Block[];
    nextIndex: number = 0;
    //
    static readonly DIFFICULTY_FACTOR: number = 5;
    static readonly MAX_DIFFICULTY: number = 62;


    /**
     * Creates a new Blockchain
     */
    constructor(){
        // initiate array with the genesis block
        this.chain = [Block.genesis()];
        this.nextIndex++;
        //console.log('The blockchain starts with: ', this.chain);
    }

    /**
     * Return last block on blockchain
     * @returns Block - return last block
     */
    getLastBlock(): Block{
        return this.chain[this.chain.length -1];
    }

    getDifficulty(): number{
        return Math.ceil(this.chain.length / Blockchain.DIFFICULTY_FACTOR) + 1;
    }

    /**
     * Add block on chain
     */
    addBlock(block: Block): Validation{
        // 
        const lastBlock = this.getLastBlock();
        // verify
        const validation = block.isValid(lastBlock.index, lastBlock.hash, this.getDifficulty())
        if(!validation.success) return Blockchain.INVALID_BLOCK(validation.message);
        // add
        this.chain.push(block);
        this.nextIndex++;
        return Blockchain.BLOCK_ADDED;
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
        // check the entire blockchain from the last to the first block
        for(let i: number = this.chain.length -1 ; i > 0 ; i--){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // compare the current with the previous
            const validation: Validation = currentBlock.isValid(previousBlock.index, previousBlock.hash, this.getDifficulty());
            // returns block number and error message found
            if(!validation.success) return Blockchain.INVALID_BLOCK_NO(currentBlock.index, validation.message);
        }   
        return Blockchain.VALID_BLOCKCHAIN;
    }

    getFeePerTx(): number{
        return 1;
    }

    getNextBlock(): BlockInfo{
        const nextIndex = this.chain.length;
        const previousHash = this.getLastBlock().hash;
        const difficulty = this.getDifficulty();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        const feePerTx = this.getFeePerTx();
        const transactions = [new Transaction()];
        return {
            nextIndex,
            previousHash,
            difficulty,
            maxDifficulty,
            feePerTx,
            transactions
        } as BlockInfo
    }
}