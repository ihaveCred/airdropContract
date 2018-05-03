var config = require('./config');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var HDWalletProvider = require('truffle-hdwallet-provider');
var abi = require('../build/contracts/AirDropLibraToken.json').abi;
var hdProvider = new HDWalletProvider('torch hospital call alien alien render essay duck boat vivid blossom reject',
    'https://kovan.infura.io/FNKpcXdW3Dgou3VgYI7d');
var web3 = new Web3(hdProvider);
var config = require('./config');
var ethUtil = require('./EthUtils');

var tokenContract = TruffleContract({
    abi: abi
});

function main() {

    tokenContract.setProvider(hdProvider);
    tokenContract.defaults({
        from: config.account.owner //this address should be lowercase
    });

    tokenContract.at(config.contractAddr).then(instance => {

        //getAirdropSupply
        instance.getAirdropSupply().then(result => {
            console.log('getAirdropSupply: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //getDistributedSupply
        instance.getDistributedSupply().then(result => {
            console.log('getDistributedSupply: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //getAirDropAmountByAddress
        instance.getAirDropAmountByAddress('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('getAirDropAmountByAddress: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)


    }).catch(console.log);
}

// main(process.argv[2], process.argv[3]);

main();
