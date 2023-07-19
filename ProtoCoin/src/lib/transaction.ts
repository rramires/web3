import { SHA256 } from "crypto-js";
import Validation from "./validation";
import TransactionType from "./transactionType";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";
import Blockchain from "./blockchain";

/**
 * Transaction class
 */
export default class Transaction{

    /** Valid transaction. */
    static VALID_TRANSACTION: Validation = new Validation(true, "Valid transaction.");

    /** Invalid timestamp */
    static INVALID_TIMESTAMP: Validation = new Validation(false, "Invalid timestamp."); 

    /** Invalid hash */
    static INVALID_HASH: Validation = new Validation(false, "Invalid hash."); 

    /** Invalid TXO. */
    static INVALID_TXO: Validation = new Validation(false, "Invalid TXO."); 

    /** Invalid TXO reference hash. */
    static INVALID_TXO_REF_HASH: Validation = new Validation(false, "Invalid TXO reference hash."); 
   
    /** Invalid input tx: {msg} */
    static INVALID_INPUT_TX(msg: string): Validation{
        return new Validation(false, `Invalid input tx: ${msg}`);
    }

    /** Invalid tx: output greater than input. */
    static INVALID_TXO_GREATER: Validation = new Validation(false, "Invalid tx: output greater than input."); 

    /** Invalid tx reward. */
    static INVALID_TX_REWARD: Validation = new Validation(false, "Invalid tx reward."); 


    /**
     * Generate reward transaction from output
     * @param txo TransactionOutput
     * @returns Transaction
     */
    static fromReward(txo: TransactionOutput): Transaction{
        // Add Tx reward
        const tx = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [txo]
        }as Transaction);

        // hash tx
        tx.hash = tx.getHash();
        // copy hash to output
        tx.txOutputs[0].tx = tx.hash;
        //
        return tx;
    }


    type: TransactionType;
    timestamp: number;
    txInputs: TransactionInput[] | undefined;
    txOutputs: TransactionOutput[];
    hash: string;

    /**
     * Creates a new Transaction
     * @param tx Transaction - optional
     */
    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        
        // map sub objects
        this.txInputs = tx?.txInputs ? tx.txInputs.map(txi => new TransactionInput(txi)) : undefined;
        this.txOutputs = tx?.txOutputs ? tx.txOutputs.map(txo => new TransactionOutput(txo)) : [];

        // hash this
        this.hash = tx?.hash || this.getHash();

        // apply tx hash in all outputs
        this.txOutputs.forEach((txo, index, arr) => arr[index].tx = this.hash);
    }

    /**
     * Generate and return the transaction hash
     * @returns string - hash
     */
    getHash(): string{
        // concat hashes
        const from = this.txInputs && this.txInputs.length ? 
                        this.txInputs.map(txi => txi.signature).join(",") : "";
        const to = this.txOutputs && this.txOutputs.length ? 
                        this.txOutputs.map(txi => txi.getHash()).join(",") : "";
        // hash all
        return SHA256(this.type +
                      this.timestamp +
                      from + 
                      to +
                      this.txOutputs).toString();
    }

    /**
     * Validates the Transaction 
     * @param difficulty number
     * @param totalFees number
     * @returns Validation - return if block is valid
     */
    isValid(difficulty: number, totalFees: number): Validation{
        if(this.timestamp < 0) return Transaction.INVALID_TIMESTAMP;
        //if(!this.txOutputs) return Transaction.INVALID_DATA;
        if(this.hash !== this.getHash()) return Transaction.INVALID_HASH;

        // Check TXO's
        // check reference hash
        if (this.txOutputs.some(txo => txo.tx !== this.hash)) return Transaction.INVALID_TXO_REF_HASH;
        // check if is valid
        if (!this.txOutputs || !this.txOutputs.length || this.txOutputs.map(txo => txo.isValid()).some(v => !v.success)){
            return Transaction.INVALID_TXO;
        }
            
        // Check TXI's
        if (this.txInputs && this.txInputs.length) {
            // validate all inputs
            const validations = this.txInputs.map(txi => txi.isValid()).filter(v => !v.success);
            if (validations && validations.length) {
                const message = validations.map(v => v.message).join(" ");
                return Transaction.INVALID_INPUT_TX(message);
            }
            // check if output greater than input
            const inputSum = this.txInputs.map(txi => txi.amount).reduce((a, b) => a + b, 0);
            const inputOutput = this.txOutputs.map(txo => txo.amount).reduce((a, b) => a + b, 0);
            if (inputSum < inputOutput) return Transaction.INVALID_TXO_GREATER;
        }

        // Validate TX FEE
        if (this.type === TransactionType.FEE) {
            const txo = this.txOutputs[0];
            // check if the miner passes a value greater than the blockchain calculates
            if(txo.amount > Blockchain.getRewardAmount(difficulty) + totalFees) return Transaction.INVALID_TX_REWARD;
        }
        //
        // else - success
        return Transaction.VALID_TRANSACTION;
    }

    /**
     * Get sum of transaction fees
     * @returns number
     */
    getFee(): number {
        let inputSum: number = 0;
        let outputSum: number = 0;
        // if there are inputs (if you don't have inputs, it's a fee transaction)
        if (this.txInputs && this.txInputs.length){
            // sum inputs
            inputSum = this.txInputs.map(txi => txi.amount).reduce((a, b) => a + b);
            // if there are outputs
            if (this.txOutputs && this.txOutputs.length){
                // sum outputs
                outputSum = this.txOutputs.map(txo => txo.amount).reduce((a, b) => a + b);
            }
            // the difference between inputs and outputs is the fees
            return inputSum - outputSum;
        }
        return 0;
    }
}