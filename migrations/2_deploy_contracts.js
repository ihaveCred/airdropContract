var LibraToken = artifacts.require("./LibraToken.sol");
var AirdropLibraToken = artifacts.require("./AirdropLibra.sol");

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
        deployer.deploy(AirdropLibraToken, args[3], args[4], args[5]);
    }

};
