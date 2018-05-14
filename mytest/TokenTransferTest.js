var config = require('./config');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var HDWalletProvider = require('truffle-hdwallet-provider');
var abi = require('../build/contracts/LibraToken.json').abi;
var hdProvider = require('./DefaultProvider').provider();
var web3 = new Web3(hdProvider);
var config = require('./config');
var ethUtil = require('./EthUtils');

function transfer() {
    var tokenContract = TruffleContract({
        abi: abi
    });

    tokenContract.setProvider(hdProvider);
    tokenContract.defaults({
        from: config.account.owner //this address should be lowercase
    });

    tokenContract.at('0x1c82d64b91e2a1195da32651477e82a9f68d4bf6').then(instance => {

        //getAirdropSupply
        instance.transfer('0x5bfa16e93b47d1a1b09e557f0074ecc2b04e5f9b ',1000000000000000000000000).then(console.log).catch(console.log)


    }).catch(console.log);
}

// transfer();