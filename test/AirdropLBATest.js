const LibraToken = artifacts.require("LibraToken");
const AirdropLibraToken = artifacts.require("AirdropLibraToken");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('AirdropLibraToken Test ----- ', function ([owner, account1, account2, account3]) {
    const startTime = 1525258592;
    const endTime = 1525517792;
    const distributedSupply = 10000 * (10 ** 18);
    const perAddressAirdrop = 5 * (10 ** 18);

    var lbaToken;
    var contractInstance;
    var airdrop_receivers = new Array();

    airdrop_receivers.push(account1);
    airdrop_receivers.push(account2);
    airdrop_receivers.push(account3);

    beforeEach(async function () {
        lbaToken = await LibraToken.new({from: owner});
        contractInstance = await AirdropLibraToken.new(lbaToken.address, distributedSupply, startTime, endTime, {from: owner});
        await lbaToken.transfer(contractInstance.address, distributedSupply,{from: owner});
    });
    describe('distribute LBA tokens ', function () {

        it('start airdrop one by one', async function () {
            for (let i=0; i< 2; i++){
                await contractInstance.airdropTokens(airdrop_receivers[i], perAddressAirdrop);
            }

        });


        it(' ---- airdropTokensBatch ', async function () {
            var amountsArr = new Array();
            for (let i=0; i< airdrop_receivers.length; i++){
                amountsArr.push(perAddressAirdrop);
            }

            await contractInstance.airdropTokensBatch(airdrop_receivers, amountsArr);

        });

        it('update end time', async function () {
            await contractInstance.updateAirdropEndTime(1526280945);
        });

        it('transfer balance out', async function () {
            var result = await contractInstance.transferOutBalance({from: owner});
            result.should.equal(true);
        });

        it('add admin', async function () {
            await contractInstance.addAdmin(account1);
            let result = await contractInstance.isAdmin(account1);
            result.should.equal(true);
        });

        it('remove admin', async function () {
            await contractInstance.removeAdmin(account1);
            let result = await contractInstance.isAdmin(account1);
            result.should.equal(false);
        });



    });
});