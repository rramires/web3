import Validation from "./validation";
import sha256 from 'crypto-js/sha256';

/**
 * Transaction Output class
 */
export default class TransactionOutput {


    /** Invalid negative amount. */
    static INVALID_NEGATIVE_AMOUNT: Validation = new Validation(false, "Invalid, negative amount.");

    /** Valid transaction output. */
    static VALID_TX_OUTPUT: Validation = new Validation(true, "Valid transaction output.");

    toAddress: string;
    amount: number;
    tx?: string;

    /**
     * Creates a new TransactionOutput
     * @param txOutput - TransactionOutput optional
     */
    constructor(txOutput?: TransactionOutput) {
        this.toAddress = txOutput?.toAddress || "";
        this.amount = txOutput?.amount || 0;
        this.tx = txOutput?.tx || "";
    }

    isValid(): Validation{
        if (this.amount < 1) return TransactionOutput.INVALID_NEGATIVE_AMOUNT;

        return TransactionOutput.VALID_TX_OUTPUT;
    }

    getHash(): string{
        return sha256(this.toAddress + this.amount).toString();
    }
}