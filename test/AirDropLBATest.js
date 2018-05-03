const LibraToken = artifacts.require("LibraToken");
const AirDropLibraToken = artifacts.require("AirDropLibraToken");

var HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'torch hospital call alien alien render essay duck boat vivid blossom reject';
var provider = new HDWalletProvider(mnemonic, "https://kovan.infura.io/FNKpcXdW3Dgou3VgYI7d");
provider.engine.on('error', e => {});
const Web3 = require('web3');

const web3 = new Web3(provider);

contract('AirDropLibraToken Test ----- ', function (accounts) {
    let startTime = 1525258592;
    let endTime = 1525517792;
    let distributedSupply = 1000;
    var lbaToken;
    var contractInstance;
    let airdrop_receivers = new Array();
    const lbaTokenAddress = '0x4ea9d5265acde72b998fb24ff47bedce230896aa';

    beforeEach(async () => {
        lbaToken = await LibraToken.at(lbaTokenAddress);
        contractInstance = await LibraTokenSale.new(distributedSupply, startTime, endTime);

        await lbaToken.transfer(contractInstance, distributedSupply);
    });
    
    function createTestUsers() {
        for (var i = 0; i< 50; i++){
            var acc = web3.eth.accounts.create();
            airdrop_receivers[i] = acc.address;
        }
    }

    describe('distribute LBA tokens ', function () {
        createTestUsers();

        for(var i = 0; i < airdrop_receivers.length; i++){
            contractInstance.airdropTokens(airdrop_receivers[i], 10);
        }

    });
});