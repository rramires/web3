import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import TransactionSearch from "./transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Blockchain class
 */
export default class Blockchain {

    // messages

    /** Block added. */
    static BLOCK_ADDED: Validation = new Validation(true, "Block added.");

    /** Valid blockchain. */
    static VALID_BLOCKCHAIN: Validation = new Validation(true, "Valid blockchain.");

    /** BC - Invalid block {msg} */
    static INVALID_BLOCK(msg: string): Validation{
        return new Validation(false, `BC - Invalid block: ${msg}`);
    }

    /** Invalid block No {X}: {msg} */
    static INVALID_BLOCK_NO(no: number, msg: string): Validation{
        return new Validation(false, `Block No ${no}: ${msg}`);
    }

    /** Invalid transactions length. */
    static INVALID_TXS_LENGTH: Validation = new Validation(false, "Invalid transactions length.");

    /** Invalid duplicate transaction. */
    static INVALID_TX_DUPLICATED: Validation = new Validation(false, "Invalid duplicate transaction.");

    /** There is a pending transaction from the same wallet. */
    static PENDING_TX_SAME_WALLET: Validation = new Validation(false, "There is a pending transaction from the same wallet.");

    /** Invalid tx: the TXO is already spent or unexistent. */
    static INVALID_TXO_SPENT_OR_NO_EXISTENT: Validation = new Validation(false, "Invalid tx: the TXO is already spent or unexistent");

    /** Transaction added. */
    static TRANSACTION_ADDED: Validation = new Validation(true, "Transaction added.");

    /** Invalid transaction {msg} */
    static INVALID_TRANSACTION(msg: string): Validation{
        return new Validation(false, `Invalid transaction: ${msg}`);
    }

    /** There is no next block. */
    static INVALID_NO_NEXT_BLOCK: Validation = new Validation(true, "There is no next block.");

    /**
     * Get reward amount
     * @param difficulty 
     * @returns number
     */
    static getRewardAmount(difficulty: number): number {
        return (64 - difficulty) * 10;
    }

    // props
    chain: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;
    //
    // default values
    static readonly DIFFICULTY_FACTOR: number = 5; // init difficulty
    static readonly MAX_DIFFICULTY: number = 62; // max difficulty
    static readonly TXS_PER_BLOCK: number = 2; // block size



    /**
     * Creates a new Blockchain
     * @param miner - string 
     */
    constructor(miner: string){
        // start mempool
        this.mempool = [];
        // start chain
        this.chain = [];
        // start chain array with the genesis block
        this.chain = [this.genesis(miner)];
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

    /**
     * Calculate difficulty
     * @returns number
     */
    getDifficulty(): number{
        return Math.ceil(this.chain.length / Blockchain.DIFFICULTY_FACTOR) + 1;
    }

    /**
     * Create the first block
     * @param miner - string
     * @returns Block - return genesis block
     */
    genesis(miner: string): Block{
        // calculate the reward
        const reward = Blockchain.getRewardAmount(this.getDifficulty()); 
        // create transaction
        const tx = Transaction.fromReward(new TransactionOutput({
                                        amount: reward,
                                        toAddress: miner
                                    } as TransactionOutput));
        // create block
        const block = new Block();
        block.transactions = [tx];
        block.previousHash = "0".repeat(Blockchain.DIFFICULTY_FACTOR) + "_this_is_the_genesis_block";
        block.mine(1, miner);
        //
        return block;
    }

    /**
     * Add a transaction to the mempool
     */
    addTransaction(transaction: Transaction): Validation{
        // verify Tx
        const validation = transaction.isValid(this.getDifficulty(), this.getFeePerTx());
        if(!validation.success) return Blockchain.INVALID_TRANSACTION(validation.message);
        // verify Tx duplicated in mempool
        if(this.mempool.some(tx => tx.hash === transaction.hash)) return Blockchain.INVALID_TX_DUPLICATED;
        //
        // Check inputs
        if (transaction.txInputs && transaction.txInputs.length > 0){
            //
            // Limits to one pending transaction per wallet 
            // (in this currency example this was done for simplicity)
            const from = transaction.txInputs[0].fromAddress;
            // Checks if the wallet already has a transactions in the mempool 
            const pendingTx = this.mempool
                                .filter(tx => tx.txInputs && tx.txInputs.length)
                                .map(tx => tx.txInputs)
                                .flat()
                                .filter(txi => txi!.fromAddress === from);
            // skip
            if(pendingTx && pendingTx.length > 0) return Blockchain.PENDING_TX_SAME_WALLET;
            //
            // validate the origin of the funds (UTXOs)
            const utxo = this.getUtxo(from); // get unspent 
            for(let i = 0; i < transaction.txInputs.length; i++){
                const txi = transaction.txInputs[i]; 
                // checks if the UTXO exists and if it has enough balance
                if (utxo.findIndex(txo => txo.tx === txi.previousTx && txo.amount >= txi.amount) === -1){
                    return Blockchain.INVALID_TXO_SPENT_OR_NO_EXISTENT;
                }    
            }
        }
        //
        // add transaction 
        this.mempool.push(transaction);
        return Blockchain.TRANSACTION_ADDED;
    }

    /**
     * Add block on chain
     */
    addBlock(block: Block): Validation{
        const nextBlock = this.getNextBlock();
        if (!nextBlock) return Blockchain.INVALID_NO_NEXT_BLOCK;
        // 
        // verify
        const validation = block.isValid(nextBlock.nextIndex -1, nextBlock.previousHash, nextBlock.difficulty, nextBlock.feePerTx)
        if(!validation.success) return Blockchain.INVALID_BLOCK(validation.message);
        //
        // removes the transactions that will be added from the mempool
        const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE) // filter to exclude type FEE
                                      .map(tx => tx.hash); // get block hashes
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash)); // remove from mempool
        // checks if the amount of transactions is equivalent 
        if(newMempool.length + txs.length !== this.mempool.length) return Blockchain.INVALID_BLOCK(Blockchain.INVALID_TXS_LENGTH.message);
        // replaces mempool
        this.mempool = newMempool;
        //
        // add
        this.chain.push(block);
        this.nextIndex++;
        return Blockchain.BLOCK_ADDED;
    }

    /**
     * Return block by hash
     * @returns TransactionSearch - return trasaction with mempool or block index
     */
    getTransaction(hash: string): TransactionSearch{
        // find in mempool
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);
        if (mempoolIndex !== -1){
            return {
                mempoolIndex,
                blockIndex: -1,
                transaction: this.mempool[mempoolIndex]
            } as TransactionSearch;
        }
        else{
            // find in blocks
            const blockIndex = this.chain.findIndex(b => b.transactions.some(tx => tx.hash === hash));
            if(blockIndex !== -1){
                return {
                    mempoolIndex: -1,
                    blockIndex,
                    transaction: this.chain[blockIndex].transactions.find(tx => tx.hash === hash)
                } as TransactionSearch;
            }
        }
        // if not found
        return { blockIndex: -1, mempoolIndex: -1 } as TransactionSearch;
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
            const validation: Validation = currentBlock.isValid(previousBlock.index, previousBlock.hash, this.getDifficulty(), this.getFeePerTx());
            // returns block number and error message found
            if(!validation.success) return Blockchain.INVALID_BLOCK_NO(currentBlock.index, validation.message);
        }   
        return Blockchain.VALID_BLOCKCHAIN;
    }

    getFeePerTx(): number{
        return 1;
    }

    getNextBlock(): BlockInfo | null{
        // skip if mempool is empty
        if(!this.mempool || !this.mempool.length) return null;
        // copy part of mempool limited by max transactions per block
        const transactions = this.mempool.slice(0, Blockchain.TXS_PER_BLOCK);
        //
        const nextIndex = this.chain.length;
        const previousHash = this.getLastBlock().hash;
        const difficulty = this.getDifficulty();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        const feePerTx = this.getFeePerTx();
        return {
            nextIndex,
            previousHash,
            difficulty,
            maxDifficulty,
            feePerTx,
            transactions
        } as BlockInfo
    }

    getTxInputs(wallet: string): (TransactionInput | undefined)[] {
        return this.chain.map(b => b.transactions) // all transactions in blocks
                        .flat() // to single array
                        .filter(tx => tx.txInputs && tx.txInputs.length) // only those with tx inputs
                        .map(tx => tx.txInputs) // all tx inputs
                        .flat() // to single array
                        .filter(txi => txi!.fromAddress === wallet); // filter by wallet
    }

    getTxOutputs(wallet: string): TransactionOutput[] {
        return this.chain.map(b => b.transactions) // all transactions in blocks
                        .flat() // to single array
                        .filter(tx => tx.txOutputs && tx.txOutputs.length) // only those with tx outputs
                        .map(tx => tx.txOutputs) // all tx outputs
                        .flat() // to single array
                        .filter(txo => txo.toAddress === wallet); // filter by wallet
    }

    getUtxo(wallet: string): TransactionOutput[] {
        const txIns = this.getTxInputs(wallet); // get the expenses 
        const txOuts = this.getTxOutputs(wallet); // get the receipts

        // if it was never spent
        if (!txIns || !txIns.length) return txOuts;

        // serarch spents
        txIns.forEach(txi => {
            // remove what has already been spent
            const index = txOuts.findIndex(txo => txo.amount === txi!.amount);
            txOuts.splice(index, 1);
        })
        // return what was not spent
        return txOuts;
    }

    getBalance(wallet: string): number {
        // get unspent 
        const utxo = this.getUtxo(wallet);
        // skip
        if (!utxo || !utxo.length) return 0;
        // accumulate and return total
        return utxo.reduce((a, b) => a + b.amount, 0);
    }
}