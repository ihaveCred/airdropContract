pragma solidity ^0.4.17;

import "./LibraToken.sol";


contract AirdropLibraToken {

    address owner;

    // The LBA token
    LibraToken private token;


    //airdrop event
    event Airdrop(address _receiver, uint256 amount);

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }


    function AirdropLibraToken(
        ERC20 _token
    ) public {
        token = LibraToken(_token);
        owner = msg.sender;
    }


    function airdropTokens(address _recipient, uint256 amount) public onlyOwner  {
        require(amount > 0);

        uint256 lbaBalance = token.balanceOf(this);

        require(lbaBalance >= amount);

        token.transfer(_recipient, amount);

        Airdrop(_recipient, amount);

    }

    //batch airdrop, key-- the receiver's address, value -- receiver's amount
    function airdropTokensBatch(address[] receivers, uint256[] amounts) public onlyOwner{
        require(receivers.length > 0 && receivers.length == amounts.length);
        for (uint256 i = 0; i < receivers.length; i++){
            airdropTokens(receivers[i], amounts[i]);
        }
    }

    function transferOutBalance() public onlyOwner {

        uint256 _balanceOfThis = token.balanceOf(this);
        if(_balanceOfThis > 0){
            token.transfer(owner, _balanceOfThis);
        }
    }

    //How many tokens are left without payment
    function balanceOfThis() public view returns (uint256){
        return token.balanceOf(this);
    }


}

