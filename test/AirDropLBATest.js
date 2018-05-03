const LibraToken = artifacts.require("LibraToken");
const AirDropLibraToken = artifacts.require("AirDropLibraToken");

var BigNumber = require('bignumber.js').BigNumber;
var HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'torch hospital call alien alien render essay duck boat vivid blossom reject';
var provider = new HDWalletProvider(mnemonic, "https://kovan.infura.io/FNKpcXdW3Dgou3VgYI7d");
provider.engine.on('error', e => {
    console.log(e);
});
const Web3 = require('web3');

const web3 = new Web3(provider);

contract('AirDropLibraToken Test ----- ', function (accounts) {
    const startTime = 1525258592;
    const endTime = 1525517792;
    const distributedSupply = new BigNumber(10000);
    let airdrop_receivers = new Array();


    beforeEach(async () => {
        for (var i = 1; i <= 5; i++){
            airdrop_receivers.push(accounts[i]);
        }

        this.lbaToken = await LibraToken.new();

        console.log('LBA token address : ' + lbaToken.address);
        this.contractInstance = await AirDropLibraToken.new(lbaToken.address, distributedSupply, startTime, endTime);

        console.log('Transfer some LBA tokens to this contract');
        await this.lbaToken.transfer(this.contractInstance, distributedSupply);

        console.log('AirDrop Contract Address : ' + this.contractInstance.address);
    });

    describe('distribute LBA tokens ', function () {

        it('begin distribute tokens', async function () {
            console.log(airdrop_receivers);

            for(var i = 0; i < airdrop_receivers.length; i++){
                console.log(airdrop_receivers[i]);
                await this.contractInstance.airdropTokens(airdrop_receivers[i], 10);
            }
        })

    });
});