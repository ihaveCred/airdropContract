var HDWalletProvider = require('truffle-hdwallet-provider');

function provider () {
    var hdProvider = new HDWalletProvider('torch hospital call alien alien render essay duck boat vivid blossom reject',
        'https://rinkeby.infura.io/FNKpcXdW3Dgou3VgYI7d');
    return hdProvider;
}

module.exports.provider = provider;