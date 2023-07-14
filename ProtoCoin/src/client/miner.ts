import dotenv from "dotenv";
dotenv.config();
//
import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";
import KeyPair from "../lib/keyPair";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";
import TransactionOutput from "../lib/transactionOutput";

const BLOCKCHAIN_SERVER = `${process.env.BLOCKCHAIN_SERVER}:${process.env.BLOCKCHAIN_PORT}/`;
// mock miner wallet
const minerWallet = new KeyPair(process.env.MINER_WALLET);
console.log("Logged as: " + minerWallet.publicKey);

let totalMined = 0;

async function mine(){
    //
    console.log("Getting next block info...");
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
    //
    // check 
    if (!data) {
        console.log("No tx found. Waiting...");
        // call again in 5 seconds
        return setTimeout(() => {
            mine();
        }, 5000);
    }
    //
    // calculate reward 
    function getRewardTx(): Transaction{
        //
        let amount = 10; // TODO: implement reward calc

        // tx output
        const txo = new TransactionOutput({
            toAddress: minerWallet.publicKey,
            amount 
        } as TransactionOutput);

        // Add Tx reward
        const tx = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [txo]
        }as Transaction);

        // hash tx
        tx.hash = tx.getHash();
        // copy hash to output
        tx.txOutputs[0].tx = tx.hash;
        //
        return tx;
    }
    //
    // create block
    const blockInfo = data as BlockInfo;
    // get new block
    const newBlock = Block.getFromInfo(blockInfo);
    // add reward transaction
    newBlock.transactions.push(getRewardTx());
    // add miner
    newBlock.miner = minerWallet.publicKey;
    // generate hash
    newBlock.hash = newBlock.getHash();
    //
    // mining
    console.log('Start mining block#', blockInfo);
    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);
    //
    // send to blockchain
    console.log('Block mined! Sending to blockchain:');
    try{
        // post new block
        await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBlock);
        console.log('Block sent and accepted!');
        totalMined++;

    }
    catch(error: any){
        console.error(error.response ? error.response.data : error.message);
    }
    //
    // call again
    setTimeout(() =>{
        mine();
    }, 1000); 
}
mine();
