import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import readline from 'readline';
import KeyPair from "../lib/keyPair";
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';


const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const BLOCKCHAIN_PORT = process.env.BLOCKCHAIN_PORT;


let myWalletPub = "";
let myWalletPriv = "";

/**
 * Create console in-out interface
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


/**
 * Print main menu
 */
function menu() {
    // await 
    setTimeout(() => {
        // clear screen
        console.clear();
        //
        if(myWalletPub){
            console.log(`You are logged as ${myWalletPub}`);
        }
        else{
            console.log(`You aren't logged.`);
        }
            
        // Options
        console.log("1 - Create Wallet");
        console.log("2 - Recover Wallet");
        console.log("3 - Balance");
        console.log("4 - Send tx");
        console.log("5 - Search tx");
        // check option
        rl.question("Choose your option: ", (answer) => {
            switch (answer) {
                case "1": createWallet(); break;
                case "2": recoverWallet(); break;
                case "3": getBalance(); break;
                case "4": sendTx(); break;
                case "5": searchTx(); break;
                default: {
                    console.log('Wrong option!');
                    menu();
                }
            }
        })

    }, 1000) // 1 second
}
menu();


/**
 * Wait to type menu
 */
function preMenu(){
    // waits for the user to type something to call menu
    rl.question(`Press any key to continue...`, () => {
        menu();
    })
}


/**
 * Create a new wallet
 */
function createWallet(){
    console.clear();
    // create new wallet
    const wallet = new KeyPair();
    console.log(`Your new wallet:`);
    console.log(wallet);
    // set the keys
    myWalletPub = wallet.publicKey;
    myWalletPriv = wallet.privateKey;
    // await menu
    preMenu();
}


/**
 * Recover wallet
 */
function recoverWallet(){
    console.clear();
    // Option
    rl.question(`What is your private key or WIF? `, (wifOrPrivateKey) => {
        // recover
        const wallet = new KeyPair(wifOrPrivateKey);
        console.log(`Your recovered wallet:`);
        console.log(wallet);
        // set the keys
        myWalletPub = wallet.publicKey;
        myWalletPriv = wallet.privateKey;
        // await menu
        preMenu();
    })
}

/**
 * Get wallet balance
 */
async function getBalance(){
    console.clear();
    // skip
    if (!myWalletPub) {
        console.log(`You don't have a wallet yet.`);
        return preMenu();
    }
    // TODO: Get balance via API
    console.log("This option isn't implemented yet!");
    //
    preMenu();
}

/**
 * Send transaction
 */
function sendTx(){
    console.clear();
    // skip
    if (!myWalletPub) {
        console.log(`You don't have a wallet yet.`);
        return preMenu();
    }
    
    console.log(`Your wallet is ${myWalletPub}`);
    
    // ask for the destination wallet
    rl.question(`To Wallet: `, (toWallet) => {
        // skip
        if (toWallet.length < 66){
            console.log(`Invalid wallet:`, toWallet.length, 'chars');
            return preMenu();
        }
        // ask for the amount
        rl.question(`Amount: `, async(amountStr) => {
            const amount = parseInt(amountStr);
            // skip
            if (!amount){
                console.log(`Invalid amount.`);
                return preMenu();
            }

            // TODO: balance validation


            // create the transaction 
            const tx = new Transaction()
            tx.timestamp = Date.now();
            tx.txOutputs = toWallet;
            tx.type = TransactionType.REGULAR;
            tx.txInputs = new TransactionInput({
                amount, // get amount
                fromAddress: myWalletPub // get the destiny
            } as TransactionInput)
            // sign the transaction with the private key
            tx.txInputs.sign(myWalletPriv);
            // generate transaction hash
            tx.hash = tx.getHash();

            // send to mempool
            try{
                const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}:${BLOCKCHAIN_PORT}/transactions/`, tx);
                console.log(`Transaction accepted. Waiting the miners!`);
                console.log(txResponse.data.hash);
            }
            catch(err: any){
                console.error(err.response ? err.response.data : err.message);
            }
            return preMenu();
        })
    })
    //
    preMenu();
}

/**
 * Search transaction
 */
function searchTx(){
    console.clear();
    // skip
    if (!myWalletPub) {
        console.log(`You don't have a wallet yet.`);
        return preMenu();
    }
    // Search TX
    rl.question(`Your tx hash: `, async (hash) => {
        const response = await axios.get(`${BLOCKCHAIN_SERVER}:${BLOCKCHAIN_PORT}/transactions/${hash}`);
        console.log(response.data);
        return preMenu();
    })
    //
    preMenu();
}