import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import sha256 from 'crypto-js/sha256';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);

/**
 * TransactionInput class
 */
export default class TransactionInput{
    
    /** Amount must be greater than zero. */
    static INVALID_AMOUNT: Validation = new Validation(false, "Amount must be greater than zero.");

    /** Invalid tx input signature. */
    static INVALID_TX_SIGNATURE: Validation = new Validation(false, "Invalid tx input signature.");

    /** Valid transaction input. */
    static VALID_TX_INPUT: Validation = new Validation(true, "Valid transaction input.");

    


    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Creates a new TransactionInput
     * @param txInput - TransactionInput optional
     */
    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "";
        this.amount = txInput?.amount || 0;
        this.signature = txInput?.signature || "";
    }

    /**
     * Generates the tx input signature
     * @param privateKey The 'from' is private key
     */
    sign(privateKey: string): void{
        // sign uses the privateKey
        this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex")) 
                            // signing the hash is equivalent to signing the other properties
                            .sign(Buffer.from(this.getHash(), "hex"))
                            .toString("hex");
    }

    /**
     * Generate and return the tx input hash
     * @returns string - hash
     */
    getHash(): string{
        // *** the signature must not be part of the hash
        return sha256(this.fromAddress + this.amount).toString();
    }

    /**
     * Validates the TransactionInput
     * @returns Validation - return if tx inpiut is valid
     */
    isValid(): Validation{
        // check amount
        if(this.amount < 1) return TransactionInput.INVALID_AMOUNT;
        // check signature
        const hash = Buffer.from(this.getHash(), "hex");
        // verify uses the publicKey
        const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress, "hex")) 
                            .verify(hash, Buffer.from(this.signature, "hex"));
        //
        return isValid ? TransactionInput.VALID_TX_INPUT : TransactionInput.INVALID_TX_SIGNATURE;
    }
}