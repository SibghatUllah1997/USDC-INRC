# INRC-USDC App

This project is a assement test and using dummy or mock stable coins for it's development. 

## Prerequisite
node version < 14.17.0
npm version < 6.3.0
yarn version = 1.22.17
USDC in the Wallet

### Description
It is a stable coin collateral system.
Here you can get INRC (indian rupee coin) by providing USDC. 
The Ration will be 1:80 respective to USDC:INRC
Another thing is that you can also redeem the USDC by Providing INRC

### How to get USDC
Create a metamask wallet by installing metamask extension guide reference https://levelup.gitconnected.com/how-to-use-metamask-a-step-by-step-guide-f380a3943fb1/. Once you have the wallet add the binance smart chain testnet to metamask by using this guide https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain. Now go to https://testnet.binance.org/faucet-smart and paste you wallet address and click on peggy token dropdown select USDC. This is how you can get the USDC.

### Instructions
Go to our site if you have USDC you can select paywith USDC from drop down and click on MINT (if you haven't provide the USDC contract allowance to INR contract in that case the first transaction will be approve then you can perform MINT) function then confirm the transaction and wait for transaction to be successful. However, if you have INRC you can also redeem the USDC just click with pay with INRC from dropdown perform the same thing as before your balance will get updated. You can also see your BNB balance as well as treasury fee which is about 0.5%.


### How To Run This Project
firt of all `npm i` or `yarn`
then  `npm run start` or `yarn run start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
Now perform the mentioned instruction.

### Deploy Smart Contract
Fill the env.json file and run commant `truffle migrate --network development`
