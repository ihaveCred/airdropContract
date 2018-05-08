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

        //getTodoAirdropAmounts
        instance.getTodoAirdropAmount('0x132acb73fd8047b523ed3b0642d4b1224bf9bc4b').then(result => {
            console.log('getTodoAirdropAmounts: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //isAdmin
        instance.isAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('isAdmin: ' + result)
        }).catch(console.log)

        //isAdmin
        // instance.addAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
        //     console.log('addAdmin: ' + result)
        // }).catch(console.log);


        //airdropDoneList
        // instance.airdropDoneList().then(result => {
        //     console.log('airdropDoneList: ' + result)
        // }).catch(console.log);


        //airdropDoneList
        instance.getDoneAddresses().then(result => {
            console.log('getDoneAddresses: ' + result)
        }).catch(console.log);

        //getWillDropAddresses
        instance.getTodoAirdropAddresses().then(result => {
            console.log('getWillDropAddresses: ' + result)
        }).catch(console.log);

        //getDoneAirdropAmount
        instance.getDoneAirdropAmount('0x132acb73fd8047b523ed3b0642d4b1224bf9bc4b').then(result => {
            console.log('getDoneAirdropAmount: ' + result)
        }).catch(console.log);



        //instance.transferOutBalance().then(console.log).catch(console.log);

    }).catch(console.log);
}


main();
