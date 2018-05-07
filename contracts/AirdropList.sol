pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./strings.sol";
import "./itMaps.sol";

contract AirdropList is Ownable {
    using strings for *;
    using itMaps for itMaps.itMapAddressUint;

    itMaps.itMapAddressUint addressAmountMap;

    //the list of will be airdropped
    mapping(address => uint256) public airdropList;

    //the list that has been airdropped
    mapping(address => uint256) public airdropDoneList;

    event AirdropListAddressAdded(address addr, uint256 amount);
    event AirdropListAddressRemoved(address addr);

    modifier onlyAirdropListed() {
        require(airdropList[msg.sender] > 0);
        _;
    }


    function addAddressToAirdropList(address addr, uint256 amount) onlyOwner public returns(bool success) {
        require(amount > 0);
        if (!(airdropList[addr] > 0)) {
            airdropList[addr] = amount;

            addressAmountMap.insert(addr, amount);
            AirdropListAddressAdded(addr, amount);
            success = true;
        }
    }

    function addAddressesToAirdropList(address[] addrs, uint256[] amounts) onlyOwner public returns(bool success) {
        require(addrs.length == amounts.length);
        for(uint256 i = 0; i < addrs.length; i++){
            success = addAddressToAirdropList(addrs[i], amounts[i]);
        }
    }


    function removeAddressFromAirdropList(address addr) onlyOwner public returns(bool success) {
        if (airdropList[addr] > 0) {
            delete airdropList[addr];
            addressAmountMap.remove(addr);
            AirdropListAddressRemoved(addr);
            success = true;
        }
    }

    function removeAddressesFromAirdropList(address[] addrs) onlyOwner public returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            success = removeAddressFromAirdropList[addrs[i]];
        }
    }



}