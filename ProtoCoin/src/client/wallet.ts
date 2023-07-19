import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import readline from 'readline';
import KeyPair from "../lib/keyPair";
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';
import TransactionOutput from '../lib/transactionOutput';


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
    // get balance
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}:${BLOCKCHAIN_PORT}/wallets/${myWalletPub}`);
    console.log("Balance: " + data.balance);
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

            // get wallet information
            const walletResponse = await axios.get(`${BLOCKCHAIN_SERVER}:${BLOCKCHAIN_PORT}/wallets/${myWalletPub}`);
            const balance = walletResponse.data.balance as number;
            const fee = walletResponse.data.fee as number;
            const utxo = walletResponse.data.utxo as TransactionOutput[];

            // check if the balance is enough
            if (balance < amount + fee) {
                console.log(`Insufficient balance (tx + fee).`);
                return preMenu();
            }

            /** 
             * Transfer funds 
             */

            // To simplify the algorithm, create txinputs for each output
            // *** In the real world this would make blockchain grow unnecessarily
            const txInputs = utxo.map(txo => TransactionInput.fromTxo(txo));
            // sign inputs
            txInputs.forEach((txi, index, arr) => arr[index].sign(myWalletPriv));

            // Funds transfer transaction
            const txOutputs = [] as TransactionOutput[];
            txOutputs.push(new TransactionOutput({
                toAddress: toWallet,
                amount
            } as TransactionOutput));

            // Remaining balance transaction
            const remainingBalance = balance - amount - fee;
            txOutputs.push(new TransactionOutput({
                toAddress: myWalletPub,
                amount: remainingBalance
            } as TransactionOutput));

            // create the transaction with the new inputs and outputs
            const tx = new Transaction({
                txInputs,
                txOutputs
            } as Transaction);

            // hash
            tx.hash = tx.getHash();
            // copy tx hash to outputs
            tx.txOutputs.forEach((txo, index, arr) => arr[index].tx = tx.hash);
            //
            console.log(tx);
            console.log("Remaining Balance: " + remainingBalance);

            /** End transfer funds */

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