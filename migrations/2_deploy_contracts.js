var LibraToken = artifacts.require("./LibraToken.sol");
var AirDropLibraToken = artifacts.require("./AirDropLibraToken.sol");

module.exports = function (deployer) {
    deployer.deploy(LibraToken).
        then(function () {
            deployer.deploy(AirDropLibraToken, 10000, 1525258592, 1525517792);
    });

};
