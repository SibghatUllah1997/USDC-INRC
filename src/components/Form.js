import React, { useEffect, useState } from 'react'
import { INRCContractAddress, USDCContractAddress } from "../config/contracts"
import { ethers } from 'ethers'
import { MaxUint256 } from "@ethersproject/constants";
import { toast } from 'react-toastify';

const Form = ({
    account,
    signer,
    inrcContract,
    usdcContract,
    provider
}) => {
    // Local Component states
    const [inrcBalance, setInrcBalance] = useState(0)
    const [usdcBalance, setUsdcBalance] = useState(0)
    const [selectedPrice, setSelectedPrice] = useState(0)
    const [selectedToken, setSelectedToken] = useState("")
    const [accountBalance, setAccountBalance] = useState(0)
    const [disableState, setDisableState] = useState(true)
    const [isApproved, setIsApproved] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [isMinting, setIsMinting] = useState(false)

    // State handling functions
    const getBalance = async () => {
        try {
            const usdc = await usdcContract.balanceOf(account)
            const inrc = await inrcContract.balanceOf(account)
            const ethValueUSDC = ethers.utils.formatEther(usdc);
            const ethValueINRC = ethers.utils.formatEther(inrc);
            setInrcBalance(ethValueINRC)
            setUsdcBalance(ethValueUSDC)

        } catch (error) {
            console.log("error1", error)
        }
    }
    const handleAddTotalBalance = () => {
        if (selectedToken === "USDC") {
            setSelectedPrice(usdcBalance)
        } else if (selectedToken === "INRC") {
            setSelectedPrice(inrcBalance)
        }
    }
    const estimatedGasPrice = async () => {
        try {
            const balance = await provider.getBalance(account)
            const ethValue = ethers.utils.formatEther(balance);
            setAccountBalance(Number(ethValue).toFixed(4))
        } catch (error) {
            console.log("error2", error)
        }
    }

    const handleMinting = async () => {
        try {
            setIsMinting(true)
            let wei = parseInt(ethers.utils.parseEther(selectedPrice)._hex, 16).toString()

            if (selectedToken === "USDC") {
                const transaction = await inrcContract.mintByUSDC(wei);
                await transaction.wait()
                setIsMinting(false)
                getBalance()
                estimatedGasPrice()
                toast.success("You Have successfully paid USDC to Mint INRC")
                return
            } else if (selectedToken === "INRC") {
                const transaction = await inrcContract.redeem(wei);
                await transaction.wait()
                setIsMinting(false)
                getBalance()
                estimatedGasPrice()
                toast.success("You Have successfully paid INRC to Get INRC")
                return
            }
        } catch (error) {
            console.log("error3", error)
        }
    }

    const handleApprove = async () => {
        try {
            setIsApproving(true)
            const transaction = await usdcContract.approve(INRCContractAddress, MaxUint256.toString());
            await transaction.wait()

            setIsApproving(false)
            toast.success("Allowance is approved")
            handleCheckApprove()
        } catch (error) {
            console.log("error4", error)
        }
    }
    const handleCheckApprove = async () => {
        try {
            const checkingAllowance = await usdcContract.allowance(account, INRCContractAddress);
            const ethValue = Number(ethers.utils.formatEther(checkingAllowance));
            if (!ethValue) {
                setIsApproved(false)
            } else {
                setIsApproved(true)
            }
        } catch (error) {
            console.log("error5", error)
        }
    }
    ///////////////////// UseEffects /////////////////
    useEffect(() => {
        if (account && inrcContract && usdcContract) {
            getBalance()
        }
        // eslint-disable-next-line
    }, [account, inrcContract, usdcContract])
    useEffect(() => {
        if (account && provider) {
            estimatedGasPrice()
            estimatedGasPrice()
        }
        // eslint-disable-next-line
    }, [provider, account])

    useEffect(() => {
        if (!selectedToken) {
            setDisableState(true)
        } else {
            setDisableState(false)
        }
    }, [selectedToken, selectedPrice, accountBalance])
    useEffect(() => {
        if (ethers && usdcContract && INRCContractAddress && account) {
            handleCheckApprove()
        }
        // eslint-disable-next-line
    }, [ethers, usdcContract, INRCContractAddress, account])
    return (
        <>
            <div className="container">
                <div className="main-display">
                    {selectedToken ? <>
                        <div className="display-heading">
                            <div className="doller-sign">
                                <span className="doller">$ </span>
                            </div>
                            <div className="heading">
                                <input placeholder={`Pay With ${selectedToken}`} type="number" className="form-control"
                                    value={selectedPrice || ""}
                                    min={1}
                                    disabled={isMinting || isApproving}
                                    onChange={e => setSelectedPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mainBtn">
                            <button
                                disabled={isMinting || isApproving}
                                onClick={handleAddTotalBalance}
                                className="max">MAX</button>
                        </div>
                    </> : null}
                </div>
                <div className="main-section">
                    <div className="another-section">
                        <div className="section section1">
                            <span>Pay With</span>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    disabled={isMinting || isApproving}
                                >
                                    {selectedToken ? selectedToken : "Select Token"}
                                </button>
                                <div className="dropdown-menu"
                                    onClick={e => setSelectedToken(e.target.innerText)}

                                    aria-labelledby="dropdownMenuButton">
                                    <span className="dropdown-item">
                                        USDC
                                    </span>
                                    <span className="dropdown-item">
                                        INRC
                                    </span>
                                </div>                </div>
                        </div>
                    </div>
                    <div className="another-section">
                        <div className="section section1">
                            <span>{selectedToken === "USDC" ? "MINT" : "PAY"}</span>
                            <span>INRC</span>
                        </div>
                    </div>
                    <div className="lower-section">
                        <div className="row">
                            <span>Mint Rate</span>
                            <span>1USDC = 80 INRC</span>
                        </div>
                        {selectedToken ?
                            <div className="row">
                                <span>Estimated Output</span>
                                <span> {selectedToken === "USDC" ? selectedPrice * 80 + " INRC" : selectedPrice / 80 + " USDC"} </span>
                            </div> : null}
                        {selectedToken ?
                            <div className="row">
                                <span>My Wallet Balance</span>
                                <span>{selectedToken === "USDC" ? usdcBalance + " USDC" : inrcBalance + " INRC"}</span>
                            </div> : null
                        }
                        <div className="row row-right">
                            <span>{accountBalance} BNB</span>
                        </div>
                        <div className="row row-right">
                            <span>0.5% Tx Fees</span>
                        </div>
                        {selectedToken && selectedToken === "USDC" ?
                            <div className="btn-div">
                                {usdcBalance > 0 ?
                                    <button disabled={(!selectedPrice && isApproved) || disableState || isApproving || isMinting} onClick={isApproved ? handleMinting : handleApprove} className="mint-btn">{isApproved ? "Mint" : "Approve"}</button>
                                    :
                                    <button className="mint-btn" disabled={true}>You Do Not Have Enough USDC</button>
                                }
                            </div> : selectedToken === "INRC" ?
                                <div className="btn-div">
                                    {inrcBalance > 0 ?
                                        <button disabled={disableState || isApproving || isMinting} onClick={handleMinting}
                                            max={inrcBalance}
                                            className="mint-btn">{"Mint"}</button> :
                                        <button className="mint-btn" disabled={true}>You Do Not Have Enough INRC</button>
                                    }
                                </div> : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Form
