pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./LibraToken.sol";
import "./AirdropList.sol";


contract AirdropLibraToken is AirdropList {
    using SafeMath for uint256;


    uint256 decimal = 10**uint256(18);

    //How many tokens will be airdropped
    uint256 TOTAL_AIRDROP_SUPPLY = 0;
    uint256 TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY.mul(decimal)  ;

    //How many tokens has been distributed
    uint256 distributedTotal = 0;

    uint256 airdropStartTime;
    uint256 airdropEndTime;

    // The LBA token
    LibraToken private token;

    // List of admins
    mapping (address => bool) public airdropAdmins;


    //the list that has been airdropped addresses
    address[] public airdropDoneList;

    //the map that has been aridropped with address and amount
    mapping(address => uint256) airdropDoneAmountMap;


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
        airdropList[_recipient] = 0;

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


        super.deleteAddrFromWillDropList(_recipient);

        //remove from the airdrop map
        if(addressAmountMap.contains(_recipient)){
            addressAmountMap.remove(_recipient);
        }

        if(TOTAL_AIRDROP_SUPPLY != lbaBalance){
            TOTAL_AIRDROP_SUPPLY = lbaBalance;
        }
        TOTAL_AIRDROP_SUPPLY = TOTAL_AIRDROP_SUPPLY.sub(amount);
        distributedTotal = distributedTotal.add(amount);

        Airdrop(_recipient, amount);

    }

    function airdropTokensFromAddresList() public onlyOwnerOrAdmin onlyWhileAirdropPhaseOpen{
        if(addressAmountMap.size() > 0){
            uint tmpInt = addressAmountMap.size();
            for (uint i = 0; i < tmpInt; i++){
                airdropTokens(addressAmountMap.getKeyByIndex(i), addressAmountMap.getValueByIndex(i));
                --tmpInt;
                --i;
            }
        }

    }

    function transferOutBalance() public onlyOwner() returns (bool){
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
    function getAirdropSupply() public onlyOwnerOrAdmin view returns (uint256){
        return TOTAL_AIRDROP_SUPPLY;
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

    //get the amount in the airdrop list
    function getAirdropAmountByAddress(address _user) public view returns (uint256) {
        return airdropList[_user];
    }

    //get all addresses that has been airdropped
    function getDoneAddresses() public constant returns (address[]){
        return airdropDoneList;
    }

    //get the amount has been dropped by user's address
    function getDoneAirdropAmount(address _addr) public view returns (uint256){
        return airdropDoneAmountMap[_addr];
    }

    //get all addresses that will be airdropped, those addresses have not yet be distributed candy
    function getWillDropAddresses() public constant returns (address[]){
        return willAirdropList;
    }

}

