require('babel-register')({
    ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "mnemonic";

module.exports = {
    mocha: {
        useColors: true
    },
    networks: {
        development: {
            provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/FNKpcXdW3Dgou3VgYI7d"),
            network_id: "*"
        }
    }
};