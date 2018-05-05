var Web3 = require('web3');
var BigNumber = require('bignumber.js').BigNumber;
var web3 = new Web3(null);

function eth2Wei(eth) {
    return web3.utils.toWei(eth, 'ether');
}

function wei2Eth(wei) {
    return new BigNumber(wei).div(Math.pow(10,18)).toString();
    //return web3.utils.fromWei(wei, 'ether');
}

module.exports = {
    eth2Wei,
    wei2Eth
}