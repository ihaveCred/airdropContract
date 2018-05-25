var LibraToken = artifacts.require("./LibraToken.sol");
var AirdropLibraToken = artifacts.require("./AirdropLibraToken.sol");

module.exports = function (deployer) {
    const args = process.argv.slice();

    console.log('args length: ' + args.length);
    /*deployer.deploy(LibraToken).
        then(function () {
            deployer.deploy(AirdropLibraToken, LibraToken.address, 10000, 1525258592, 1525517792);
    });*/

    if(args.length < 6){
        console.error('args number error');

    }else {
        /**
         * args[3] LBA token address
         * args[4] Airdrop start time
         * args[5] Airdrop end time
         *
         * example: truffle migrate 0xfe5f141bf94fe84bc28ded0ab966c16b17490657,1527161566,1842780766
         * */
        deployer.deploy(AirdropLibraToken, args[3], args[4], args[5]);
    }

};
