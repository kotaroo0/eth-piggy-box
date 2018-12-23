// const fs = require("fs");
// const solc = require("solc");
var PiggyBankInstance;
var userAccount;

function startApp() {
  var PiggyBankAddress = "0xB33Dfd56E971053ae82Cf02952CA00A2bC833374";
  PiggyBankInstance = web3js.eth.contract(PiggyBankABI).at(PiggyBankAddress);
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];
  });
}

// 新しい貯金箱を作成する
function createPiggyBank(msgSender, _goalAmount) {
  let PiggyBankContract = web3js.eth.contract(PiggyBankABI);
  PiggyBankContract.new(
    _goalAmount,
    {
      data: PiggyBankBytecode,
      from: msgSender,
      gas: 3000000
    },
    function(err, PiggyBankInstance) {
      if (!err) {
        if (!PiggyBankInstance.address) {
          console.log(PiggyBankInstance.transactionHash);
        } else {
          console.log(PiggyBankInstance.address);
          localStorage.setItem(PiggyBankInstance.address, msgSender);
        }
      }
    }
  );
}

function deposit(fromAddress, toAddress, ethAmount) {
  let weiAmount = web3js.toWei(ethAmount, "ether");
  // トランザクションオブジェクトを作成します。
  txObject = {
    from: fromAddress, // Ether の送付元アドレス
    to: toAddress, // Ether の送付先アドレス
    value: weiAmount // 送付する Ether の量（単位は wei）
  };

  PiggyBankInstance.deposit.sendTransaction(txObject, function(
    error,
    txHash
  ) {});

  // web3js.eth.sendTransaction(txObject, function(error, txHash) {});
}

function watchDepositEvent() {
  var depositEvent = PiggyBankInstance.Deposit();
  //イベント監視
  depositEvent.watch(function(error, result) {
    console.log('watching "Deposit" event!');
    if (!error) console.log(result);
    updateBalance("0xaabf09b933b928fdf458ad366fbda72f6955f0e3");
  });
}

function destroy() {
  PiggyBankInstance.destroy({ from: userAccount }, function(err, result) {});
}

function watchDestroyEvent() {
  var destroyEvent = PiggyBankInstance.Destroy();
  //イベント監視
  destroyEvent.watch(function(error, result) {
    console.log('watching "Destroy" event!');
    if (!error) {
      console.log(result);
      localStorage.removeItem("");
    }
  });
}

function updateBalance(address) {
  web3js.eth.getBalance(address, function(err, balance) {
    console.log(balance.c[0]);
    console.log(balance);
    $(".balance").text(balance.c[0]);
  });
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
    console.log("Launched!");
  } else {
    alert("No provider detected.");
  }
  startApp();
  watchDepositEvent();
  watchDestroyEvent();
});

$("#create").click(function() {
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];
    createPiggyBank(userAccount, 100);
  });
});

$(".deposit").click(function() {
  // Ether の送付元アドレス
  fromAddress = "0x486228BF3488F76FB937874a6Db7FeA33E3cBC72";

  // Ether の送付先アドレス
  // toAddress = "0xB33Dfd56E971053ae82Cf02952CA00A2bC833374";
  toAddress = $(".deposit").data("contract-address");
  // console.log(toAddress);

  ethAmount = $(".amount").val();
  deposit(fromAddress, "0x4ab0bec22e25a5c07505870b7b9678920c53eacb", ethAmount);
});

$(".destroy").click(function() {
  destroy();
});

// console.log(PiggyBankInstance);
// var depositEvent = PiggyBankInstance.Deposit();
// //イベント監視
// depositEvent.watch(function(error, result) {
//   console.log('watching "Deposit" event!');
//   if (!error) console.log(result);
// });
