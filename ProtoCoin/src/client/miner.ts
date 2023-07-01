import dotenv from "dotenv";
dotenv.config();
//
import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";

const BLOCKCHAIN_SERVER = `${process.env.BLOCKCHAIN_SERVER}:${process.env.BLOCKCHAIN_PORT}/`;
// mock miner wallet
const minerWallet = {
    privateKey: "myPrivateKey",
    publickKey: `${process.env.MINER_WALLET}`,
}
console.log("Logged as: " + minerWallet.publickKey);

let totalMined = 0;

async function mine(){
    //
    console.log("Getting next block info...");
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
    // check 
    if (!data) {
        console.log("No tx found. Waiting...");
        // call again in 5 seconds
        return setTimeout(() => {
            mine();
        }, 5000);
    }
    //
    const blockInfo = data as BlockInfo;
    // get new block
    const newBlock = Block.getFromInfo(blockInfo);
    //
    // TODO: Add Tx reward
    //
    console.log('Start mining block#', blockInfo);
    newBlock.mine(blockInfo.difficulty, minerWallet.publickKey);
    //
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
    // call again
    setTimeout(() =>{
        mine();
    }, 1000); 
}
mine();
