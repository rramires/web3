import { SHA256 } from "crypto-js";
import Validation from "../validation";
import TransactionType from "../transactionType";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

// moocks


/**
 * Mocked Transaction class
 */
export default class Transaction{
    type: TransactionType;
    timestamp: number;
    txInputs: TransactionInput[] | undefined;
    txOutputs: TransactionOutput[];
    hash: string;

    /** Valid transaction. */
    static VALID_TRANSACTION: Validation = new Validation(true, "Valid transaction.");

    /** Invalid timestamp */
    static INVALID_TIMESTAMP: Validation = new Validation(false, "Invalid timestamp."); 

    /** Invalid data */
    static INVALID_DATA: Validation = new Validation(false, "Invalid data."); 

    /** Invalid hash */
    static INVALID_HASH: Validation = new Validation(false, "Invalid hash."); 

    /**
     * 
     * @param tx Transaction - optional
     */
    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.txInputs = tx?.txInputs || [new TransactionInput()];
        this.txOutputs = tx?.txOutputs || [new TransactionOutput()];
        this.hash = tx?.hash || this.getHash();
    }

    /**
     * Generate and return the transaction hash
     * @returns string - hash
     */
    getHash(): string{
        return "fakeHash";
    }

    /**
     * Validates the Transaction 
     * @returns Validation - return if block is valid
     */
    isValid(difficulty: number, totalFees: number): Validation{
        if(this.timestamp < 0) return Transaction.INVALID_TIMESTAMP;
        //
        // else - success
        return Transaction.VALID_TRANSACTION;
    }


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

        // force undefined 
        tx.txInputs = undefined;
        // hash tx
        tx.hash = tx.getHash();
        // copy hash to output
        tx.txOutputs[0].tx = tx.hash;
        //
        return tx;
    }
}