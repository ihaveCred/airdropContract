pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./itMaps.sol";

contract AirdropList is Ownable {

    // false: not allowed put into airdropList receivers
    bool internal airdropLock = false;

    //the map of will be airdropped
    mapping(address => uint256) internal todoAirdropMap;
    address[] internal todoAirdropList;

    event AirdropListAddressAdded(address addr, uint256 amount);
    event AirdropListAddressRemoved(address addr);

    modifier onlyAirdropListed() {
        require(todoAirdropMap[msg.sender] > 0);
        _;
    }


    function addAddressToAirdropList(address addr, uint256 amount) onlyOwner public returns(bool success) {
        require(amount > 0);
        require(!airdropLock);

        todoAirdropMap[addr] = amount;

        todoAirdropList.push(addr);
        AirdropListAddressAdded(addr, amount);
        success = true;
    }

    //the address index in addrs and the amount in amounts must be one by one
    function addAddressesToAirdropList(address[] addrs, uint256[] amounts) onlyOwner public returns(bool success) {
        require(!airdropLock);
        require(addrs.length == amounts.length);
        for(uint256 i = 0; i < addrs.length; i++){
            success = addAddressToAirdropList(addrs[i], amounts[i]);
        }
    }


    function removeAddressFromAirdropList(address addr) onlyOwner public returns(bool success) {
        if (todoAirdropMap[addr] > 0) {
            delete todoAirdropMap[addr];

            deleteAddrFromWillDropList(addr);

            AirdropListAddressRemoved(addr);
            success = true;
        }
    }

    function removeAddressesFromAirdropList(address[] addrs) onlyOwner public returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            success = removeAddressFromAirdropList(addrs[i]);
        }
    }


    //delete an address from given array
    function deleteAddrFromWillDropList(address addr) internal{
        if(todoAirdropList.length > 0){
            if(todoAirdropList.length == 1){
                delete todoAirdropList[0];
                todoAirdropList.length = 0;
            }else{
                for (uint i=0; i<todoAirdropList.length - 1; i++){
                    if (todoAirdropList[i] == addr) {
                        todoAirdropList[i] = todoAirdropList[todoAirdropList.length - 1];
                        break;
                    }
                }
                todoAirdropList.length -= 1;
            }

        }
    }



}