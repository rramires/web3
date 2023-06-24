import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";

const BLOCKCHAIN_SERVER = 'http://localhost:3000/';
// mock miner wallet
const minerWallet = {
    privateKey: "myPrivateKey",
    publickKey: "myPublicKey",
}

let totalMined = 0;

async function mine(){
    //
    console.log("Getting next block info...");
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
    const blockInfo = data as BlockInfo;
    // get new block
    const newBlock = Block.getFromInfo(blockInfo);
    //
    // TODO: Add Tx reward
    //
    console.log('Start mining block#', blockInfo);
    newBlock.mine(blockInfo.difficulty, minerWallet.publickKey);
    //
    console.log('Block mined! Sending to blockchain:', newBlock);
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
