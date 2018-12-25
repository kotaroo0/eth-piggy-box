pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

// ETH貯金箱
contract PiggyBank is Ownable {

    uint256 public goalAmount; // 貯金目標額(wei)

    event Deposit(address userAddress, address contractAddress, uint amount);
    event Destroy(address userAddress, address contractAddress, uint amount);

    // コントラクトの初期化
    constructor(uint _goalAmount) {
        goalAmount = _goalAmount;
    }

    // ETHを貯金する
    function deposit() onlyOwner payable {
        emit Deposit(msg.sender, address(this), msg.value);
    }

    // 貯金箱を壊してお金を取り出す
    function destroy() onlyOwner {
        address contractAddress = address(this);
        uint amount = contractAddress.balance;
        require(amount >= goalAmount, "Insufficient Savings");
        emit Destroy(msg.sender, contractAddress, amount);
        selfdestruct(owner());
    }
}
