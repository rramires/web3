import Web3 from "web3";
import ABI from './abi.json';

const CONTRACT_ADDRESS = `${process.env.REACT_APP_CONTRACT_ADDRESS}`;

export async function mint(){
    // Check
    if(!window.ethereum){
        throw new Error('No Webwallet found!');
    }
    // Connect to wallet
    const web3 = new Web3(window.ethereum);

    // Get permission and return accounts array
    const accounts = await web3.eth.requestAccounts();
    // Check accounts
    if(!accounts || !accounts.length){
        throw new Error('No account allowed!');
    }

    // Connect to contract
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
        from: accounts[0]
    });

    // Call mint
    const tx = await contract.methods.mint().send();

    // Return transaction
    return tx.transactionHash;
}