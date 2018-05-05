## Libra airdrop smart contract

This is a smart contract for airdrop LBA tokens

### 1 install
        $ npm install

### 2 complie contract source
        $ truffle complie
        
### 3 deploy contract
        $ truffle migrate lbaTokenAddress airdropSupply startTime endTime
        
### 4 airdrop tokens
Replace the contractAddr field value in the test/config.js file with the contract address generated in the third step

Example:
   ######A) Airdrop tokens single 
            airdropContract.setProvider(hdProvider);
            airdropContract.defaults({
                from: config.account.owner //contract creator or admin
            });
        
            tokenContract.at(config.contractAddr).then(instance => {
        
                //airdropTokens
                instance.airdropTokens('0x837745738...', ethUtil.eth2Wei(amount)).then(result => {
                    console.log('txHash: ' + result.tx)
                }).catch(console.log)
        
        
            }).catch(console.log);
            
   ######B) Airdrop tokens batch
   The owner or admins should add the airdropList to this contract first.
    
            var accounts = new Array();
            var amounts = new Array();
            for(var i=0; i < 5 ; i++){
                let account = web3.eth.accounts.create().address;
                accounts.push(account);
                amounts.push(2 * (10 ** 18));
                console.log('new Account: ' + account);
            }
    
            instance.addAddressesToAirdropList(accounts, amounts).then(console.log).catch(console.log);
   
   And then call the function "airdropTokensFromAddresList" to execute transaction.
   
            instance.airdropTokensFromAddresList().then(console.log);
   