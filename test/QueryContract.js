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

        //getAirdropAmountByAddress
        instance.getAirdropAmountByAddress('0x6deba915baeedcb4a75282d6716442b872861516').then(result => {
            console.log('getAirdropAmountByAddress: ' + ethUtil.wei2Eth(result.toString()))
        }).catch(console.log)

        //isAdmin
        instance.isAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
            console.log('isAdmin: ' + result)
        }).catch(console.log)

        //isAdmin
        // instance.addAdmin('0x6e27727Bbb9F0140024A62822f013385F4194999').then(result => {
        //     console.log('addAdmin: ' + result)
        // }).catch(console.log);

        //airdropList
        instance.airdropList('0xEF767D2E65907f54A7b8e68fD3d8A54582096Dd5').then(result => {
            console.log('airdropList: ' + result)
        }).catch(console.log);

        //airdropDoneList
        // instance.airdropDoneList().then(result => {
        //     console.log('airdropDoneList: ' + result)
        // }).catch(console.log);


        //airdropDoneList
        instance.getDoneAddresses().then(result => {
            console.log('getDoneAddresses: ' + result)
        }).catch(console.log);

        //getWillDropAddresses
        instance.getWillDropAddresses().then(result => {
            console.log('getWillDropAddresses: ' + result)
        }).catch(console.log);

        //getDoneAirdropAmount
        instance.getDoneAirdropAmount('0x5Fe4d4b289c408000Af1b1e541F7195F8165eC34').then(result => {
            console.log('getDoneAirdropAmount: ' + result)
        }).catch(console.log);

        //getAirdropAmountByAddress
        instance.getAirdropAmountByAddress('0x5Fe4d4b289c408000Af1b1e541F7195F8165eC34').then(result => {
            console.log('getAirdropAmountByAddress: ' + result)
        }).catch(console.log);




        //instance.transferOutBalance().then(console.log).catch(console.log);

    }).catch(console.log);
}


main();
