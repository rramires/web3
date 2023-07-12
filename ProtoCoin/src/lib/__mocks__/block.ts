import Transaction from "./transaction"; // mock
import Validation from "../validation";
import TransactionType from "../transactionType";
import TransactionOutput from "./transactionOutput";
import Blockchain from "../blockchain";

/**
 * Mocked Block class
 */
export default class Block{

    /** Valid block. */
    static VALID_BLOCK: Validation = new Validation(true, "Valid block.");

    /** Invalid block. */
    static INVALID_BLOCK: Validation = new Validation(false, "Invalid block.");


    index: number;
    timestamp: number;
    nonce: number;
    miner: string;
    hash: string;
    previousHash: string;
    transactions: Transaction[];

    /**
     * Creates a new Block
     * @param block - Block optional
     */
    constructor(block?: Block){
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.previousHash = block?.previousHash || "";
        this.transactions = block?.transactions || [] as Transaction[];
        this.hash = this.getHash();
    }

    /**
     * Create the first block
     * @param miner - string
     * @returns Block - return genesis block
     */
    static genesis(miner: string): Block{
        // TODO: calculate the reward
        const reward = 10; 

        // create transaction
        const tx: Transaction = new Transaction();
        tx.type = TransactionType.FEE;
        tx.txOutputs = [new TransactionOutput({
        amount: reward,
        toAddress: miner
        } as TransactionOutput)]
        // hash tx
        tx.hash = tx.getHash();
        // add hash to output
        tx.txOutputs[0].tx = tx.hash;

        // create block
        const block = new Block();
        block.transactions = [tx];
        block.previousHash = "0".repeat(Blockchain.DIFFICULTY_FACTOR) + "_this_is_the_genesis_block";
        block.mine(1, miner);
        //
        return block;
    }

    /**
     * Generate and return the block hash
     * @returns string - hash
     */
    getHash():string {
        return this.hash || "mockHash";
    }

    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty The blockchain current difficulty
     * @param miner The miner wallet address
     */
    mine(difficulty: number, miner: string){
        //
        this.miner = miner;
    }

    /**
     * Validates the Block
     * @param previousIndex number - last block index
     * @param previousHash string - last block hash
     * @returns Validation - return if block is valid
     */
    isValid(previousIndex: number, previousHash: string): Validation{
        // simple validation mock
        if(this.index < 0 || previousIndex < 0 || !previousHash) return Block.INVALID_BLOCK; 
        // esle
        return Block.VALID_BLOCK;
    }
}