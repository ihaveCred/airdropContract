pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./LibraToken.sol";


contract AirdropLibraToken is Ownable {
    using SafeMath for uint256;


    uint256 decimal = 10**uint256(18);

    //How many tokens will be airdropped
    uint256 TOTAL_AIRDROP_SUPPLY = 4000000;
    uint256 TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY.mul(decimal)  ;

    //How many tokens has been distributed
    uint256 distributedTotal = 0;

    uint256 airdropStartTime;
    uint256 airdropEndTime;

    // The LBA token
    LibraToken private token;

    // List of admins
    mapping (address => bool) public airdropAdmins;



    //the map that has been airdropped, key -- address ,value -- amount
    mapping(address => uint256) public airdropDoneAmountMap;
    //the list that has been airdropped addresses
    address[] public airdropDoneList;


    //airdrop event
    event Airdrop(address _receiver, uint256 amount);

    event AddAdmin(address _admin);

    event RemoveAdmin(address _admin);

    event UpdateEndTime(address _operator, uint256 _oldTime, uint256 _newTime);



    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || airdropAdmins[msg.sender]);
        _;
    }


    function addAdmin(address _admin) public onlyOwner {
        airdropAdmins[_admin] = true;
        AddAdmin(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        if(isAdmin(_admin)){
            airdropAdmins[_admin] = false;
            RemoveAdmin(_admin);
        }
    }


    modifier onlyWhileAirdropPhaseOpen {
        require(block.timestamp > airdropStartTime && block.timestamp < airdropEndTime);
        _;
    }


    function AirdropLibraToken(
        ERC20 _token,
        uint256 _airdropTotal,
        uint256 _airdropStartTime,
        uint256 _airdropEndTime
    ) public {
        token = LibraToken(_token);
        TOTAL_AIRDROP_SUPPLY = _airdropTotal;
        airdropStartTime = _airdropStartTime;
        airdropEndTime = _airdropEndTime;

        TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY.mul(decimal);

    }


    function airdropTokens(address _recipient, uint256 amount) public onlyOwnerOrAdmin onlyWhileAirdropPhaseOpen {
        require(amount > 0);

        uint256 lbaBalance = token.balanceOf(this);

        require(lbaBalance >= amount);

        require(token.transfer(_recipient, amount));


        //put address into has done list
        airdropDoneList.push(_recipient);

        //update airdropped actually
        uint256 airDropAmountThisAddr = 0;
        if(airdropDoneAmountMap[_recipient] > 0){
            airDropAmountThisAddr = airdropDoneAmountMap[_recipient].add(amount);
        }else{
            airDropAmountThisAddr = amount;
        }

        airdropDoneAmountMap[_recipient] = airDropAmountThisAddr;

        distributedTotal = distributedTotal.add(amount);

        Airdrop(_recipient, amount);

    }

    //batch airdrop, key-- the receiver's address, value -- receiver's amount
    function airdropTokensBatch(address[] receivers, uint256[] amounts) public onlyOwnerOrAdmin onlyWhileAirdropPhaseOpen{
        require(receivers.length > 0 && receivers.length == amounts.length);
        for (uint256 i = 0; i < receivers.length; i++){
            airdropTokens(receivers[i], amounts[i]);
        }
    }

    function transferOutBalance() public onlyOwner view returns (bool){
        address creator = msg.sender;
        uint256 _balanceOfThis = token.balanceOf(this);
        if(_balanceOfThis > 0){
            LibraToken(token).approve(this, _balanceOfThis);
            LibraToken(token).transferFrom(this, creator, _balanceOfThis);
            return true;
        }else{
            return false;
        }
    }

    //How many tokens are left without payment
    function balanceOfThis() public view returns (uint256){
        return token.balanceOf(this);
    }

    //how many tokens have been distributed
    function getDistributedTotal() public view returns (uint256){
        return distributedTotal;
    }


    function isAdmin(address _addr) public view returns (bool){
        return airdropAdmins[_addr];
    }

    function updateAirdropEndTime(uint256 _newEndTime) public onlyOwnerOrAdmin {
        UpdateEndTime(msg.sender, airdropEndTime, _newEndTime);
        airdropEndTime = _newEndTime;
    }

    //get all addresses that has been airdropped
    function getDoneAddresses() public constant returns (address[]){
        return airdropDoneList;
    }

    //get the amount has been dropped by user's address
    function getDoneAirdropAmount(address _addr) public view returns (uint256){
        return airdropDoneAmountMap[_addr];
    }

}

