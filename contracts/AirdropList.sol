pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./itMaps.sol";

contract AirdropList is Ownable {
    using itMaps for itMaps.itMapAddressUint;

    itMaps.itMapAddressUint addressAmountMap;

    //the list of will be airdropped(for all users)
    mapping(address => uint256) public airdropList;
    address[] willAirdropList;

    event AirdropListAddressAdded(address addr, uint256 amount);
    event AirdropListAddressRemoved(address addr);

    modifier onlyAirdropListed() {
        require(airdropList[msg.sender] > 0);
        _;
    }


    function addAddressToAirdropList(address addr, uint256 amount) onlyOwner public returns(bool success) {
        require(amount > 0);

        airdropList[addr] = amount;

        willAirdropList.push(addr);
        addressAmountMap.insert(addr, amount);
        AirdropListAddressAdded(addr, amount);
        success = true;
    }

    //the address index in addrs and the amount in amounts must be one by one
    function addAddressesToAirdropList(address[] addrs, uint256[] amounts) onlyOwner public returns(bool success) {
        require(addrs.length == amounts.length);
        for(uint256 i = 0; i < addrs.length; i++){
            success = addAddressToAirdropList(addrs[i], amounts[i]);
        }
    }


    function removeAddressFromAirdropList(address addr) onlyOwner public returns(bool success) {
        if (airdropList[addr] > 0) {
            delete airdropList[addr];

            airdropList[addr] = 0;
            deleteAddrFromWillDropList(addr);

            addressAmountMap.remove(addr);
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
        if(willAirdropList.length > 0){

            for (uint i=0; i<willAirdropList.length - 1; i++){
                if (willAirdropList[i] == addr) {
                    willAirdropList[i] = willAirdropList[willAirdropList.length - 1];
                    break;
                }
            }
            willAirdropList.length -= 1;
        }
    }



}