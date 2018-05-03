pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./LibraToken.sol";

contract AirdropLibraToken is Ownable {
    using SafeMath for uint256;

    uint256 decimal = 10**uint256(18);

    //How many tokens will be airdropped
    uint256 TOTAL_AIRDROP_SUPPLY = 0;
    uint256 TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY.mul(decimal)  ;

    //How many tokens had be distributed
    uint256 distributedTotal = 0;

    uint256 airdropStartTime;
    uint256 airdropEndTime;

    // The token being dropped
    LibraToken public token;


    // List of admins
    mapping (address => bool) public airdropAdmins;

    //List of dropped users
    mapping (address => bool) public airdrops;

    //dropped users and their amount
    mapping (address => uint256) public airdropAmount;



    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || airdropAdmins[msg.sender]);
        _;
    }


    function addAdmin(address _admin) public onlyOwner {
        airdropAdmins[_admin] = true;
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
        uint256 airdropUnit = amount.mul(decimal);
        require(token.balanceOf(this) >= airdropUnit);

        if (!airdrops[_recipient]) {
            airdrops[_recipient] = true;

            airdropAmount[_recipient] = airdropUnit;

            require(token.transfer(_recipient, airdropUnit));

            TOTAL_AIRDROP_SUPPLY = TOTAL_AIRDROP_SUPPLY.sub(airdropUnit);
            distributedTotal = distributedTotal.add(airdropUnit);
        }

    }


    function getAirdropSupply() public onlyOwnerOrAdmin view returns (uint256){
        return TOTAL_AIRDROP_SUPPLY;
    }

    function getDistributedTotal() public view returns (uint256){
        return distributedTotal;
    }


    function getAirDropAmountByAddress(address _user) public view returns (uint256) {
        return airdropAmount[_user];
    }

    function isAdmin(address _addr) public view returns (bool){
        return airdropAdmins[_addr];
    }
}

