require('babel-register')({
    ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');
var mnemonic = require('./test/config').mnemonic;
var HDWalletProvider = require("truffle-hdwallet-provider");

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