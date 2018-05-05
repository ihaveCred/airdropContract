const LibraToken = artifacts.require("LibraToken");
const AirdropLibraToken = artifacts.require("AirdropLibraToken");

var BigNumber = require('bignumber.js').BigNumber;
var provider = require('./DefaultProvider').provider();
provider.engine.on('error', e => {
    console.log(e);
});
const Web3 = require('web3');

const web3 = new Web3(provider);

contract('AirdropLibraToken Test ----- ', function (accounts) {
    const startTime = 1525258592;
    const endTime = 1525517792;
    const distributedSupply = 10000 * (10 ** 18);
    const perAddressAirdrop = 5 * (10 ** 18);
    var airdrop_receivers = new Array();

    describe('distribute LBA tokens ', function () {
        var lbaToken;
        var contractInstance;
        
        beforeEach(async () => {
            for (var i = 0; i < 5; i++){
                airdrop_receivers.push(web3.eth.accounts.create().address);
            }

            // lbaToken = await LibraToken.new();
            lbaToken = await LibraToken.at('0x97edb2724ea47bc48e1ea50d139d92ff7fbf8b24');

            console.log('LBA token address : ' + lbaToken.address);
            // contractInstance = await AirdropLibraToken.new(lbaToken.address, distributedSupply, startTime, endTime);
            contractInstance = await AirdropLibraToken.at('0x94d93528b4d520a68ab70e210d898a7300a78715');

            console.log('Transfer some LBA tokens to this contract :' + contractInstance.address);
            // await lbaToken.transfer(contractInstance.address, distributedSupply);

            console.log('Accounts for receive airdrop：' + airdrop_receivers);

        });
        
        describe('Airdrop tokens one by one', function () {
            it('start airdrop', async function () {
                console.log("contractInstance：" + contractInstance);
                for (let i=0; i< airdrop_receivers.length; i++){
                    await contractInstance.airdropTokens(airdrop_receivers[i], perAddressAirdrop);
                }

            })
        });


    });
});