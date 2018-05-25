## Libra airdrop smart contract

This is a smart contract for airdrop LBA tokens

### 1 install
        $ npm install

### 2 complie contract source
        $ truffle complie
        
### 3 deploy contract
        $ truffle migrate lbaTokenAddress startTime endTime
        
### 4 airdrop tokens
Replace the contractAddr field value in the test/config.js file with the contract address generated in the third step

Example:

   ###### A) Airdrop tokens single 
            airdropContract.setProvider(hdProvider);
            airdropContract.defaults({
                from: config.account.owner //contract creator or admin
            });
        
            airdropContract.at(config.contractAddr).then(instance => {
        
                //airdropTokens
                instance.airdropTokens('0x837745738...', ethUtil.eth2Wei(amount)).then(result => {
                    console.log('txHash: ' + result.tx)
                }).catch(console.log)
        
        
            }).catch(console.log);
            
### 5 contract operation
        instance.updateAirdropEndTime(newEndTime);
   param: 'newEndTime' --- unix timestamp.
   
   effect: Allow owner or admin modify airdrop end time .
   
        instance.transferOutBalance();
   effect: This function can transfer all LBA balance of this contract to the owner.
   
        instance.addAdmin(newAdminAddress);
        instance.removeAdmin(adminAddress);
   param: address which will added or removed admin.
   
   effect: Allow owner add or remove a admin address from this contract.


   ###### B) Airdrop tokens batch
   The owner or admins can call the function 'airdropTokensBatch(address[] receivers, uint256 amounts)' to do airdrop batch transaction.
   Please note that the receivers array and amount array index must be one by one,
   for example: the index of address A is 3, and the index of A's amount in the second array parameter must be 3. 
    
            var accounts = new Array();
            var amounts = new Array();
            for(var i=0; i < 5 ; i++){
                let account = web3.eth.accounts.create().address;
                accounts.push(account);
                amounts.push(2 * (10 ** 18));
                console.log('new Account: ' + account);
            }
    
            instance.airdropTokensBatch(accounts, amounts).then(console.log).catch(console.log);
   
            
### FAQ        
#### Q: How did i know that my LBA tokens have been arrived
     1) You can track the aridrop transaction on this website:https://etherscan.io/,
        enter your receive address and query it.Unfold 'Token Balances' options and you will see the LBA balance.
     2) Of course, the easiest way is to use the MetaMask wallet, you can install the wallet into your google chrome
        on this website: https://metamask.io/.
        After wallet installed, you should add the LBA token into your MetaMask wallet, paste the
        LBA token address '0xfe5f141bf94fe84bc28ded0ab966c16b17490657' into your wallet and then the token
        balance will refresh automatically.

   