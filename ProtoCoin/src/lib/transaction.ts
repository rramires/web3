import { SHA256 } from "crypto-js";
import Validation from "./validation";
import TransactionType from "./transactionType";
import TransactionInput from "./transactionInput";

/**
 * Transaction class
 */
export default class Transaction{

    /** Valid transaction. */
    static VALID_TRANSACTION: Validation = new Validation(true, "Valid transaction.");

    /** Invalid timestamp */
    static INVALID_TIMESTAMP: Validation = new Validation(false, "Invalid timestamp."); 

    /** Invalid data */
    //static INVALID_DATA: Validation = new Validation(false, "Invalid data."); 

    /** Invalid hash */
    static INVALID_HASH: Validation = new Validation(false, "Invalid hash."); 

    /** `Invalid input tx: {msg} */
    static INVALID_INPUT_TX(msg: string): Validation{
        return new Validation(false, `Invalid input tx: ${msg}`);
    }

    type: TransactionType;
    timestamp: number;
    txInputs: TransactionInput | undefined;
    txOutputs: string;
    hash: string;

    /**
     * Creates a new Transaction
     * @param tx Transaction - optional
     */
    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        /* c8 ignore next */
        this.txInputs = tx && tx.txInputs ? new TransactionInput(tx?.txInputs) : undefined;
        //
        this.txOutputs = tx?.txOutputs || "";
        this.hash = tx?.hash || this.getHash();
    }

    /**
     * Generate and return the transaction hash
     * @returns string - hash
     */
    getHash(): string{
        const from = this.txInputs ? this.txInputs.getHash() : "";
        return SHA256(this.type +
                      this.timestamp +
                      from +
                      this.txOutputs).toString();
    }

    /**
     * Validates the Transaction 
     * @returns Validation - return if block is valid
     */
    isValid(): Validation{
        if(this.timestamp < 0) return Transaction.INVALID_TIMESTAMP;
        //if(!this.txOutputs) return Transaction.INVALID_DATA;
        if(this.hash !== this.getHash()) return Transaction.INVALID_HASH;
        // optional
        if(this.txInputs){
            const validation = this.txInputs.isValid();
            if(!validation.success) return Transaction.INVALID_INPUT_TX(validation.message);
        }
        //
        // else - success
        return Transaction.VALID_TRANSACTION;
    }
}