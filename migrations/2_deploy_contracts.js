var LibraToken = artifacts.require("./LibraToken.sol");
var AirdropLibraToken = artifacts.require("./AirdropLibraToken.sol");

module.exports = function (deployer) {
    /*deployer.deploy(LibraToken).
        then(function () {
            deployer.deploy(AirdropLibraToken, LibraToken.address, 10000, 1525258592, 1525517792);
    });*/

    deployer.deploy(AirdropLibraToken, '0x4ea9d5265acde72b998fb24ff47bedce230896aa', 10000, 1525258592, 1525517792);


};
