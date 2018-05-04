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

async function airdropTokens(address, amount, txRaw) {
    console.log('receiver address: ' + address);
    console.log('airdrop amount: ' + amount);

    if (!(address && amount)){
        console.error('缺少必要的参数');
        return;
        process.exit(0);
    }

    let params = {
        from: config.account.owner
    };
    if (txRaw) {
        params = txRaw;
    }

    tokenContract.setProvider(hdProvider);
    tokenContract.defaults({
        from: config.account.owner //this address should be lowercase
    });

    tokenContract.at(config.contractAddr).then(instance => {

        //collectTokens
        instance.airdropTokens(address.toLowerCase(), ethUtil.eth2Wei(amount)).then(result => {
            console.log('txHash: ' + result.tx)
        }).catch(console.log)


    }).catch(console.log);
}


function main() {
    var accounts = new Array();
    for(var i=0; i<50; i++){
        let account = web3.eth.accounts.create().address;
        accounts.push(account);
        console.log('new Account: ' + account);
    }


    web3.eth.getTransactionCount(config.contractAddr).then(count => {
        let nonce = count;

        for (let i = 0; i < accounts.length; i++){
            let txRaw = {
                nonce: nonce + i + 1
            }



            airdropTokens(accounts[i], 1, txRaw);
        }
    });

   /* for(var i=0; i<50; i++){
        let account = web3.eth.accounts.create().address;
        accounts.push(account);
        console.log('new Account: ' + account);
    }

    accounts.forEach(function (account) {
        airdropTokens(account, 1);
    })*/
}

function random1To500() {
    return ( Math.floor ( Math.random () * 61 )  + 60 );
}

main();