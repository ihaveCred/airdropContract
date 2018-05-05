var config = require('./config');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var HDWalletProvider = require('truffle-hdwallet-provider');
var abi = require('../build/contracts/AirdropLibraToken.json').abi;
var hdProvider = require('./DefaultProvider').provider();
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

        //getDistributedTotal
        instance.getDistributedTotal().then(result => {
            console.log('getDistributedTotal: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //getAirDropAmountByAddress
        instance.getAirDropAmountByAddress('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('getAirDropAmountByAddress: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //isAdmin
        instance.isAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('isAdmin: ' + result)
        }).catch(console.log)

        //isAdmin
        instance.addAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('addAdmin: ' + result)
        }).catch(console.log)


    }).catch(console.log);
}


// main();
