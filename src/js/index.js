var PiggyBankContract;
var web3js;

function etherToWei(etherAmount) {
  return web3js.toWei(etherAmount, "ether");
}

function weiToEther(weiAmount) {
  return web3js.fromWei(weiAmount, "ether");
}

function startApp() {
  PiggyBankContract = web3js.eth.contract(PiggyBankABI);
  for (piggyBankInstanceAddress in localStorage) {
    if (piggyBankInstanceAddress.length < 40) {
      continue;
    }
    $(".container").append(
      `<div class=\"piggy-bank ${piggyBankInstanceAddress} d-inline-block m-2\">\
        <div class=\"card\" style=\"width: 20rem;\">\
          <img class=\"card-img-top\" src=\"img/piggy_bank.png\">\
          <div class=\"card-body\">\
            <p class=\"card-text\">Contract Address: <span class=\"contract-address\">${piggyBankInstanceAddress}</span></p>\
            <p class=\"card-text\">Owner Address: <span class=\"owner-address\">${
              localStorage[piggyBankInstanceAddress]
            }</span></p>\
            <p class=\"card-text\">Saving Amount: <span class=\"saving-amount\">0</span></p>\
            <p class=\"card-text\">Goal Amount: <span class=\"goal-amount\">loading...</span></p>\
            <p class=\"card-text\">\
              <div>Amount(eth):</div>\
              <input type=\"number\" class=\"amount\" name=\"example\" value=\"1\">\
              <button type=\"button\" class=\"deposit btn btn-primary btn-sm\">Deposit</button>\
            </p>\
            <p class=\"card-text text-right\">\
              <button type=\"button\" class=\"destroy btn btn-danger btn-sm w-100\">Destroy</button>\
            </p>\
          </div>\
        </div>\
      </div>`
    );
    updateBalance(piggyBankInstanceAddress);
    updateGoalAmount(piggyBankInstanceAddress);
    watchDepositEvent(piggyBankInstanceAddress);
    watchDestroyEvent(piggyBankInstanceAddress);
  }
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];
  });
}

// 新しい貯金箱を作成する
function createPiggyBank(msgSender, goalEthAmount) {
  // let PiggyBankContract = web3js.eth.contract(PiggyBankABI);
  PiggyBankContract.new(
    etherToWei(goalEthAmount),
    {
      data: PiggyBankBytecode,
      from: msgSender,
      gas: 3000000
    },
    function(err, piggyBankInstance) {
      if (!err) {
        piggyBankInstanceAddress = piggyBankInstance.address;
        if (!piggyBankInstanceAddress) {
          console.log(piggyBankInstance.transactionHash);
        } else {
          watchDepositEvent(piggyBankInstanceAddress);
          watchDestroyEvent(piggyBankInstanceAddress);
          console.log(piggyBankInstanceAddress);
          localStorage.setItem(piggyBankInstanceAddress, msgSender);
          $(".container")
            .append(`<div class=\"piggy-bank ${piggyBankInstanceAddress} d-inline-block m-2\">\
        <div class=\"card\" style=\"width: 20rem;\">\
          <img class=\"card-img-top\" src=\"img/piggy_bank.png\">\
          <div class=\"card-body\">\
            <p class=\"card-text\">Contract Address: <span class=\"contract-address\">${piggyBankInstanceAddress}</span></p>\
            <p class=\"card-text\">Owner Address: <span class=\"owner-address\">${msgSender}</span></p>\
            <p class=\"card-text\">Saving Amount: <span class=\"saving-amount\">0</span></p>\
            <p class=\"card-text\">Goal Amount: <span class=\"goal-amount\">${goalEthAmount}</span></p>\
            <p class=\"card-text\">\
              <div>Amount(eth):</div>\
              <input type=\"number\" class=\"amount\" name=\"example\" value=\"1\">\
              <button type=\"button\" class=\"deposit btn btn-primary btn-sm\">Deposit</button>\
            </p>\
            <p class=\"card-text text-right\">\
              <button type=\"button\" class=\"destroy btn btn-danger btn-sm w-100\">Destroy</button>\
            </p>\
          </div>\
        </div>\
      </div>`);
        }
      }
    }
  );
}

function deposit(fromAddress, toAddress, ethAmount) {
  // トランザクションオブジェクトを作成します。
  txObject = { from: fromAddress, to: toAddress, value: etherToWei(ethAmount) }; // Ether の送付元アドレス // Ether の送付先アドレス // 送付する Ether の量（単位は wei）

  PiggyBankContract.at(toAddress).deposit.sendTransaction(txObject, function(
    error,
    txHash
  ) {});

  // web3js.eth.sendTransaction(txObject, function(error, txHash) {});
}

function watchDepositEvent(contractAddress) {
  var depositEvent = PiggyBankContract.at(contractAddress).Deposit();
  //イベント監視
  depositEvent.watch(function(error, result) {
    console.log('watching "Deposit" event!');
    if (!error) console.log(result);
    updateBalance(contractAddress);
  });
}

function destroy(userAddress, contractAddress) {
  PiggyBankContract.at(contractAddress).destroy({ from: userAddress }, function(
    err,
    result
  ) {
    console.log(err);
    console.log(result);
  });
}

function watchDestroyEvent(contractAddress) {
  var destroyEvent = PiggyBankContract.at(contractAddress).Destroy();
  //イベント監視
  destroyEvent.watch(function(error, result) {
    console.log('watching "Destroy" event!');
    if (!error) {
      // TODO
      console.log(result);
      localStorage.removeItem(contractAddress);
      $(`.${contractAddress}`).remove();
    }
  });
}

function updateBalance(contractAddress) {
  web3js.eth.getBalance(contractAddress, function(err, balance) {
    $(`.${contractAddress} .saving-amount`).text(balance.c[0] / 10000);
  });
}

function updateGoalAmount(contractAddress) {
  PiggyBankContract.at(contractAddress).goalAmount(function(err, amount) {
    $(`.${contractAddress} .goal-amount`).text(amount.c[0] / 10000);
  });
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
    console.log("Launched!");
  } else {
    alert("No provider detected.");
    return;
  }
  startApp();
});

$("#create").click(function() {
  var goalAmount = $("#goal-amount").val();
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];
    createPiggyBank(userAccount, goalAmount);
  });
});

$(".container").on("click", ".deposit", function(event) {
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];

    var targetPiggyBank = $(event.target).parents(".piggy-bank");
    var fromAddress = targetPiggyBank.find(".owner-address").text(); // Etherの送付元アドレス
    if (userAccount !== fromAddress) {
      // TODO
      // alert("not correct user");
      // return;
    }
    var toAddress = targetPiggyBank.find(".contract-address").text(); // 貯金先のアドレス
    var ethAmount = targetPiggyBank.find(".amount").val(); // Etherの送付量
    deposit(fromAddress, toAddress, ethAmount);
  });
});

$(".container").on("click", ".destroy", function(event) {
  web3js.eth.getAccounts(function(err, accounts) {
    userAccount = accounts[0];
    var targetPiggyBank = $(event.target).parents(".piggy-bank");
    var fromAddress = targetPiggyBank.find(".owner-address").text(); // Etherの送付元アドレス
    // if (userAccount !== fromAddress) {
    //   // TODO
    //   alert("not correct user");
    //   return;
    // }
    var contractAddress = targetPiggyBank.find(".contract-address").text(); // 破壊する貯金箱のアドレス

    destroy(fromAddress, contractAddress);
  });
});
