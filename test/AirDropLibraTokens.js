var config = require('./config');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var HDWalletProvider = require('truffle-hdwallet-provider');
var abi = require('../build/contracts/AirDropLibraToken.json').abi;
var hdProvider = new HDWalletProvider('torch hospital call alien alien render essay duck boat vivid blossom reject',
    'https://kovan.infura.io/FNKpcXdW3Dgou3VgYI7d');
var web3 = new Web3(hdProvider);
var config = require('./config');

var tokenContract = TruffleContract({
    abi: abi
});

tokenContract.setProvider(hdProvider);
tokenContract.defaults({
    from: config.account.owner //this address must be in whitelist, and should be lowercase
});

tokenContract.at(config.contractAddr).then(instance => {

    //collectTokens
    instance.airdropTokens(config.account.user2, 20).then(console.log).catch(console.log)


}).catch(console.log);