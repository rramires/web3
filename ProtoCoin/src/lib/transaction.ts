import { SHA256 } from "crypto-js";
import Validation from "./validation";
import TransactionType from "./transactionType";

/**
 * Transaction class
 */
export default class Transaction{
    type: TransactionType;
    timestamp: number;
    data: string;
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
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    /**
     * Generate and return the transaction hash
     * @returns string - hash
     */
    getHash(): string{
        return SHA256(this.type +
                      this.timestamp +
                      this.data).toString();
    }

    /**
     * Validates the Transaction 
     * @returns Validation - return if block is valid
     */
    isValid(): Validation{
        if(this.timestamp < 0) return Transaction.INVALID_TIMESTAMP;
        if(!this.data) return Transaction.INVALID_DATA;
        if(this.hash !== this.getHash()) return Transaction.INVALID_HASH;
        //
        // else - success
        return Transaction.VALID_TRANSACTION;
    }
}