pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

// ETH貯金箱
contract PiggyBank is Ownable {

    uint256 public goalAmount; // 貯金目標額(wei)

    event Deposit(address addr, uint amount);
    event Destroy(address addr, uint amount);
    // event Withdraw(address addr, uint amount, bool done);

    // コントラクトの初期化
    constructor(uint _goalAmount) {
        goalAmount = _goalAmount;
    }

    // ETHを貯金する
    function deposit() onlyOwner payable {
        emit Deposit(msg.sender, msg.value);
    }

    // 貯金箱を壊してお金を取り出す
    function destroy() onlyOwner {
        uint amount = address(this).balance;
        require(amount >= goalAmount, "Insufficient Savings");
        emit Destroy(msg.sender, amount);
        selfdestruct(owner());
    }

    // お金を引き出す(今回は不要)
    // function withdraw() onlyOwner {
    //     uint amount = address(this).balance;
    //     require(amount >= goalAmount, "Insufficient Savings");
    //     bool ok = msg.sender.call.value(amount)();
    //     emit Withdraw(msg.sender, amount, ok);
    // }
}
