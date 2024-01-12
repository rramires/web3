import Web3 from "web3";

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

    return accounts[0];
}