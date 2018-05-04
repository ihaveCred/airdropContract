var config = require('./config');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var HDWalletProvider = require('truffle-hdwallet-provider');
var abi = require('../build/contracts/AirdropLibraToken.json').abi;
var hdProvider = new HDWalletProvider('torch hospital call alien alien render essay duck boat vivid blossom reject',
    'https://kovan.infura.io/FNKpcXdW3Dgou3VgYI7d');
var web3 = new Web3(hdProvider);
var config = require('./config');
var ethUtil = require('./EthUtils');

var tokenContract = TruffleContract({
    abi: abi
});

function main(address, amount) {
    console.log('receiver address: ' + address);
    console.log('airdrop amount: ' + amount);

    if (!(address && amount)){
        console.error('缺少必要的参数');
        return;
        process.exit(0);
    }

    tokenContract.setProvider(hdProvider);
    tokenContract.defaults({
        from: config.account.owner //this address should be lowercase
    });

    tokenContract.at(config.contractAddr).then(instance => {

        //airdropTokens
        instance.airdropTokens(address.toLowerCase(), ethUtil.eth2Wei(amount)).then(result => {
            console.log('txHash: ' + result.tx)
        }).catch(console.log)


    }).catch(console.log);
}

main(process.argv[2], process.argv[3]);

// main(config.account.user3, 0.1);

