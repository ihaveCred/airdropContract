var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var solc = require('solc');
var fs = require('fs');
var abi = require('../build/contracts/AirdropLibraToken.json').abi;
var config = require('./config');
var ethUtil = require('./EthUtils');

var hdProvider = require('./DefaultProvider').provider();

var web3 = new Web3(hdProvider);


var airdropContract = TruffleContract({
    abi: abi
});

airdropContract.setProvider(hdProvider);
airdropContract.defaults({from: '0x7355f48ad49f356353a52e02342c47ae452ff04e'});


airdropContract.at(config.contractAddr)
    .then(async function (instance) {
        //instance.addAddressToAirdropList('0x696dc02Ce137F6690c83FA348290e59E70EdFf28', ethUtil.eth2Wei('2')).then(console.log);

        var accounts = new Array();
        var amounts = new Array();
        for(var i=0; i < 5 ; i++){
            let account = web3.eth.accounts.create().address;
            accounts.push(account);
            amounts.push(2 * (10 ** 18));
            console.log('new Account: ' + account);
        }

        await instance.addAddressesToAirdropList(accounts, amounts).then(console.log).catch(console.log);

        // for (let i = 0; i < accounts.length; i++){
        //     await instance.addAddressToAirdropList(accounts[i], ethUtil.eth2Wei('1'));
        // }

        //await instance.airdropTokensFromAddresList().then(console.log);

        //instance.airdropList('0x696dc02Ce137F6690c83FA348290e59E70EdFf28').then(console.log);
    }).catch(console.log);
