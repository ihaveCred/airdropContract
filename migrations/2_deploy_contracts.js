var LibraToken = artifacts.require("./LibraToken.sol");
var AirDropLibraToken = artifacts.require("./AirDropLibraToken.sol");

module.exports = function (deployer) {
    /*deployer.deploy(LibraToken).
        then(function () {
            deployer.deploy(AirDropLibraToken, LibraToken.address, 10000, 1525258592, 1525517792);
    });*/

    deployer.deploy(AirDropLibraToken, '0x4ea9d5265acde72b998fb24ff47bedce230896aa', 10000, 1525258592, 1525517792);


};
