pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./itMaps.sol";

contract AirdropList is Ownable {
    using itMaps for itMaps.itMapAddressUint;

    itMaps.itMapAddressUint addressAmountMap;

    mapping(address => uint256) public airdropList;

    event AirdropListAddressAdded(address addr, uint256 amount);
    event AirdropListAddressRemoved(address addr);

    modifier onlyAirdropListed() {
        require(airdropList[msg.sender] > 0);
        _;
    }

    function addAddressToAirdropList(address addr, uint256 amount) onlyOwner public returns(bool success) {
        if (!(airdropList[addr] > 0)) {
            airdropList[addr] = amount;

            addressAmountMap.insert(addr, amount);
            AirdropListAddressAdded(addr, amount);
            success = true;
        }
    }


    function removeAddressFromAirdropList(address addr) onlyOwner public returns(bool success) {
        if (airdropList[addr] > 0) {
            airdropList[addr] = 0;
            addressAmountMap.remove(addr);
            AirdropListAddressRemoved(addr);
            success = true;
        }
    }

    function removeAddressesFromAirdropList(address[] addrs) onlyOwner public returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (airdropList[addrs[i]] > 0) {
                airdropList[addrs[i]] = 0;
                addressAmountMap.remove(addrs[i]);
                success = true;
            }
        }
    }

}