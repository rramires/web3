import Validation from "../validation";

/**
 * Mocked Transaction Output class
 */
export default class TransactionOutput {


    /** Invalid negative amount. */
    static INVALID_NEGATIVE_AMOUNT: Validation = new Validation(true, "Invalid, negative amount.");

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
        this.toAddress = txOutput?.toAddress || "abc";
        this.amount = txOutput?.amount || 10;
        this.tx = txOutput?.tx || "xyz";
    }

    isValid(): Validation{
        if (this.amount < 1) return TransactionOutput.INVALID_NEGATIVE_AMOUNT;

        return TransactionOutput.VALID_TX_OUTPUT;
    }

    getHash(): string{
        return "mockHash"
    }
}