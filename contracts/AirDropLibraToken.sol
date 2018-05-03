pragma solidity ^0.4.17;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./LibraToken.sol";

contract AirDropLibraToken is Ownable {
    using SafeMath for uint256;

    uint256 decimal = 10**uint256(18);
    uint256 TOTAL_AIRDROP_SUPPLY = 0;
    uint256 TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY ** decimal ;
    uint256 public distributedTotal = 0;

    uint256 airDropStartTime;
    uint256 airDropEndTime;

    // The token being dropped
    LibraToken public token;


    // List of admins
    mapping (address => bool) public airdropAdmins;

    mapping (address => bool) public airDrops;
    mapping (address => uint256) public airDropAmount;



    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || airdropAdmins[msg.sender]);
        _;
    }



    function addAdmin(address _admin) public onlyOwner {
        airdropAdmins[_admin] = true;
    }


    modifier onlyWhileAirDropPhaseOpen {
        require(block.timestamp > airDropStartTime && block.timestamp < airDropEndTime);
        _;
    }


    function AirDropLibraToken(
        ERC20 _token,
        uint256 _airDropTotal,
        uint256 _airDropStartTime,
        uint256 _airDropEndTime
    ) public {
        token = LibraToken(_token);
        TOTAL_AIRDROP_SUPPLY = _airDropTotal;
        airDropStartTime = _airDropStartTime;
        airDropEndTime = _airDropEndTime;

        TOTAL_AIRDROP_SUPPLY_UNITS = TOTAL_AIRDROP_SUPPLY ** decimal;

    }


    function airdropTokens(address _recipient, uint256 amount) public onlyOwnerOrAdmin onlyWhileAirDropPhaseOpen {
        require(amount > 0);
        uint256 airDropUnit = amount.mul(decimal);
        require(token.balanceOf(this) >= airDropUnit);

        if (!airDrops[_recipient]) {
            airDrops[_recipient] = true;

            airDropAmount[_recipient] = airDropUnit;

            require(token.transfer(_recipient, airDropUnit));

            TOTAL_AIRDROP_SUPPLY = TOTAL_AIRDROP_SUPPLY.sub(airDropUnit);
            distributedTotal = distributedTotal.add(airDropUnit);
        }

    }


    function getAirdropSupply() public onlyOwnerOrAdmin view returns (uint256){
        return TOTAL_AIRDROP_SUPPLY;
    }

    function getDistributedSupply() public onlyOwnerOrAdmin view returns (uint256){
        return distributedTotal;
    }


    function getAirDropAmountByAddress(address _user) public onlyOwnerOrAdmin view returns (uint256) {
        return airDropAmount[_user];
    }

    function isAdmin(address _addr) public view returns (bool){
        return airdropAdmins[_addr];
    }
}

