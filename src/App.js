import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import React, { useEffect, useRef , useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { ethers } from 'ethers'
import {INRCContractAddress, USDCContractAddress} from "./config/contracts"
import contractABI from "./config/INRCABI.json"
import 'react-toastify/dist/ReactToastify.css';


// Array of available nodes to connect to
export const nodes = [
  "https://data-seed-prebsc-2-s2.binance.org:8545",
  "https://data-seed-prebsc-2-s2.binance.org:8545",
  "https://data-seed-prebsc-2-s2.binance.org:8545"
]

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState("")
  const [signer, setSigner] = useState("")
  const [inrcContract, setInrcContract] = useState(null)
  const [usdcContract, setUsdcContract] = useState(null)
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChangedHandler(result);
        })
        .catch(error => {
          setErrorMessage(error.message);
          toast.error(error.message)
        });

    } else {
            toast.error('Please install MetaMask browser extension to interact')
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }
  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    if(newAccount){
        updateEthers();
          setAccount(newAccount[0])
        return
    }else{
    setAccount(null)
    return
  }
  }

  const chainChangedHandler = () => {

    window.location.reload();
    // reload the page to avoid any errors with chain change mid use of application
    updateEthers()
    // window.location.reload();
  }


  useEffect(() => {
    if(window.ethereum){
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      // listen for account changes
      tempProvider.provider.on('accountsChanged', accountChangedHandler);
    
      tempProvider.provider.on('chainChanged', chainChangedHandler);
    
    }
  }, [])
  const updateEthers = async () => {
    try {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    if((parseInt(window.ethereum.chainId, 16) !== 97)){
       await tempProvider.provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: "0x61",
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`https://testnet.bscscan.com/`],
          },
        ],
      })
    }
    setProvider(tempProvider)

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner)


    let tempInrcContract = new ethers.Contract(INRCContractAddress, contractABI, tempSigner);
    let tempUsdcContract = new ethers.Contract(USDCContractAddress, contractABI, tempSigner);
    setInrcContract(tempInrcContract)
    setUsdcContract(tempUsdcContract)
    toast.success('Wallet is Connected')
  } catch (error) {
   console.log("error6", error)   
  }
  }

  useEffect(() => {
    connectWalletHandler()
  }, [])
  return (
    <div>
      {/* <button className='btn btn-secondary' onClick={() => connectWalletHandler()}>Connect Wallet</button>/ */}
    <ToastContainer />
      <Form 
      account={account}
      signer={signer}
      inrcContract={inrcContract}
      usdcContract={usdcContract}
      provider={provider}
      />
    </div>
  );
}

export default App;
