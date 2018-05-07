var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
var solc = require('solc');
var fs = require('fs');
var ethUtil = require('./EthUtils');
var abi = require('../build/contracts/AirdropLibraToken.json').abi;
var tokenAbi = require('../build/contracts/LibraToken.json').abi;

var hdProvider = require('./DefaultProvider').provider();

var web3 = new Web3(hdProvider);


function complie(files) {
    var input = {};
    var i;

    for (i in files) {
        var file = files[i];
        input[file] = fs.readFileSync(file, 'utf8');
    }
    var output = solc.compile({sources: input}, 1);

    return output;
}




function deploy() {
    var files = ['../contracts/LibraToken.sol',
        '../contracts/AirdropLibraToken.sol',
        '../contracts/AirdropList.sol',
        '../contracts/strings.sol',
        '../contracts/itMaps.sol',
        '../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol',
        '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol',
        '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol',
        '../node_modules/zeppelin-solidity/contracts/token/ERC20/BasicToken.sol',
        '../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20.sol',
        '../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol'];
    var complieResult = complie(files);
    console.log(complieResult)

    var LibraTokenSaleCode = complieResult.contracts['../contracts/AirdropLibraToken.sol:AirdropLibraToken'].bytecode;

    var airdropContract = TruffleContract({
        abi: abi,
        unlinked_binary: LibraTokenSaleCode
    });

    airdropContract.setProvider(hdProvider);
    airdropContract.defaults({from: '0x7355f48ad49f356353a52e02342c47ae452ff04e'});

    const LBAAddress = '0x97edb2724ea47bc48e1ea50d139d92ff7fbf8b24';
    const airDropSupply = ethUtil.eth2Wei('2000');

    airdropContract.new(
        LBAAddress, //LBA token contract address
        airDropSupply, //
        1525258592, //
        1525517792) //
        .then(function (instance) {

            console.log(instance.transactionHash);
            console.log(instance.address);

            var tokenContract = TruffleContract({abi: tokenAbi});
            tokenContract.setProvider(hdProvider);
            tokenContract.defaults({from: '0x7355f48ad49f356353a52e02342c47ae452ff04e'});
            tokenContract.at(LBAAddress)
                .then(function (token) {
                    token.transfer(instance.address, airDropSupply ).then(result => {
                        console.log('Transfer success.');
                        process.exit(0);
                    });
                });


        }).catch(console.log);
}

// deploy();