pragma solidity ^0.4.25;

// ETH貯金箱
contract PiggyBank {

    // 貯金箱
    struct PiggyBank {
        uint id;
        address owner; // 所有者
        uint savingAmount; // 貯金額
        uint goalAmount; // 目標額
        bool isActive; // 貯金箱が破壊されたかどうか
    }

    PiggyBank[] public piggyBanks;

    event Create(address userAddress, uint id, uint goalAmount);
    event Deposit(address userAddress, uint id, uint amount, uint savingAmount, uint goalAmount);
    event Destroy(address userAddress, uint id, uint amount);

    function create(uint goalAmount) public {
        uint id = piggyBanks.length;
        piggyBanks.push(PiggyBank({
            id: id,
            owner: msg.sender,
            savingAmount: 0,
            goalAmount: goalAmount,
            isActive: true
        }));
        emit Create(msg.sender, id, goalAmount);
    }

    // ETHを貯金する
    function deposit(uint id) payable public {
        bool isExist = false;
        uint index = 0;
        for (uint i = 0; i < piggyBanks.length; i++) {
            if (piggyBanks[i].id == id ) {
                index = i;
                isExist = piggyBanks[index].isActive;
                break;
            }
        }
        require(isExist, "Not Exist");
        require(piggyBanks[index].owner == msg.sender, "Incorrect User");
        piggyBanks[index].savingAmount += msg.value;
        emit Deposit(msg.sender, id, msg.value, piggyBanks[index].savingAmount, piggyBanks[index].goalAmount);
    }

    // 貯金箱を壊してお金を取り出す
    function destroy(uint id) public {
        bool isExist = false;
        uint index = 0;
        for (uint i = 0; i < piggyBanks.length; i++) {
            if (piggyBanks[i].id == id) {
                index = i;
                isExist = piggyBanks[index].isActive;
                break;
            }
        }
        require(isExist, "Not Exist");
        require(piggyBanks[index].owner == msg.sender, "Incorrect User");
        require(piggyBanks[index].savingAmount >= piggyBanks[index].goalAmount, "Insufficient Saving Amount");
        msg.sender.transfer(piggyBanks[index].savingAmount);
        piggyBanks[index].isActive = false;
        emit Destroy(msg.sender, id, piggyBanks[index].savingAmount);
    }
}
