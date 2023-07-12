import Validation from '../validation';

/**
 * Mocked TransactionInput class
 */
export default class TransactionInput{

    /** Signature is required. */
    static PREV_TX_SIGNATURE_REQUIRED: Validation = new Validation(false, "Previous tx and signature is required.");
    
    /** Amount must be greater than zero. */
    static INVALID_AMOUNT: Validation = new Validation(false, "Amount must be greater than zero.");

    /** Invalid tx input signature. */
    static INVALID_TX_SIGNATURE: Validation = new Validation(false, "Invalid tx input signature.");

    /** Valid transaction input. */
    static VALID_TX_INPUT: Validation = new Validation(true, "Valid transaction input.");

    previousTx: string;
    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Creates a new TransactionInput
     * @param txInput - TransactionInput optional
     */
    constructor(txInput?: TransactionInput){
        this.previousTx = txInput?.previousTx || "xyz";
        this.fromAddress = txInput?.fromAddress || "wallet1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
    }

    /**
     * Generates the tx input signature
     * @param privateKey The 'from' is private key
     */
    sign(privateKey: string): void{
        this.signature = "abc";
    }

    /**
     * Generate and return the tx input hash
     * @returns string - hash
     */
    getHash(): string{
        return "abc";
    }

    /**
     * Validates the TransactionInput
     * @returns Validation - return if tx inpiut is valid
     */
    isValid(): Validation{
        // check previous tx and signature
        if(!this.previousTx || !this.signature) return TransactionInput.PREV_TX_SIGNATURE_REQUIRED;
        // check amount
        if(this.amount < 1) return TransactionInput.INVALID_AMOUNT;
        //
        return TransactionInput.VALID_TX_INPUT;
    }
}