var HDWalletProvider = require('truffle-hdwallet-provider');

function provider () {
    var hdProvider = new HDWalletProvider('mnemonic',
        'https://rinkeby.infura.io/FNKpcXdW3Dgou3VgYI7d');
    return hdProvider;
}

module.exports.provider = provider;