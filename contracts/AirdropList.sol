pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./strings.sol";
import "./itMaps.sol";

contract AirdropList is Ownable {
    using strings for *;
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

    function addAddressesToAirdropList(address[] addrs, uint256[] amounts) onlyOwner public returns(bool success) {
        require(addrs.length == amounts.length);
        for(uint256 i = 0; i < addrs.length; i++){
            success = addAddressToAirdropList(addrs[i], amounts[i]);
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


    function stringToUint(string s) constant returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return address(iaddr);
    }


    function bytes32ToString(bytes32 x) public returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

}