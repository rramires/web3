import * as ecc from 'tiny-secp256k1';
import ECPairFactory, { ECPairInterface } from 'ecpair';

/**
 * 
 */
const ECPair = ECPairFactory(ecc);

/**
 * Key class
 */
export default class Keys{

    // key pair
    privateKey: string;
    publicKey: string;


    /**
     * Creates a new Wallet
     */
    constructor(wifOrPrivateKey?: string){
        let keys;
        if(wifOrPrivateKey){
            // recover keys
            // from private key (hex 64 chars)
            if(wifOrPrivateKey.length === 64){
                keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey, "hex"));
            }
            // from wif (Wallet Import Format)
            else{
                keys = ECPair.fromWIF(wifOrPrivateKey);
            }
        }
        else{
             // generate keys
            keys = ECPair.makeRandom();
        }
        this.privateKey = keys.privateKey?.toString("hex") || "";
        this.publicKey = keys.publicKey?.toString("hex");
    }
}