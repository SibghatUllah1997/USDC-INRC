const INRC = artifacts.require("INRC");



module.exports = async (deployer) => {
    let account = await web3.eth.getAccounts()
  deployer.deploy(INRC, 
    // USDC address
    "0x64544969ed7EBf5f083679233325356EbE738930",
    // INR-USDC ratio
    80,
    // treasury fee with the percentage in 10000 which is 0.5
    50,
    // fee receiver 
    account[0]

    );
};
