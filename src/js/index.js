var PiggyBankContract;
var web3js;

// --- イベントリスナー(DOM) ---
window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
    PiggyBankContract = web3js.eth.contract(PiggyBankABI);
    console.log("Launched!");
    startApp(); // DOMの初期化
  } else {
    // Metamask等がない場合
    alert("No provider detected.");
  }
});

$("#create").click(function() {
  var goalAmount = $("#goal-amount").val();
  web3js.eth.getAccounts(function(err, accounts) {
    if (err) {
      alert(err);
      return;
    }
    userAccount = accounts[0];
    createPiggyBank(userAccount, goalAmount);
  });
});

$(".container").on("click", ".deposit", function(event) {
  web3js.eth.getAccounts(function(err, accounts) {
    if (err) {
      alert(err);
      return;
    }
    userAccount = accounts[0];

    var targetPiggyBank = $(event.target).parents(".piggy-bank");
    var ownerAddress = targetPiggyBank.find(".owner-address").text(); // Etherの送付元アドレス
    if (userAccount !== ownerAddress) {
      alert("This is Piggy Bank of Others!");
      return;
    }
    var toAddress = targetPiggyBank.find(".contract-address").text(); // 貯金先のアドレス
    var ethAmount = targetPiggyBank.find(".amount").val(); // Etherの送付量
    deposit(ownerAddress, toAddress, ethAmount);
  });
});

$(".container").on("click", ".destroy", function(event) {
  web3js.eth.getAccounts(function(err, accounts) {
    if (err) {
      alert(err);
      return;
    }
    userAccount = accounts[0];

    var targetPiggyBank = $(event.target).parents(".piggy-bank");
    var ownerAddress = targetPiggyBank.find(".owner-address").text(); // Etherの送付元アドレス
    if (userAccount !== ownerAddress) {
      alert("This is Piggy Bank of Others!");
      return;
    }
    var contractAddress = targetPiggyBank.find(".contract-address").text(); // 破壊する貯金箱のアドレス
    let savingAmount = $(`.${contractAddress} .saving-amount`).text();
    let goalAmount = $(`.${contractAddress} .goal-amount`).text();
    if (savingAmount < goalAmount) {
      alert("Insufficient Amount!");
      return;
    }
    destroy(ownerAddress, contractAddress);
  });
});
// END --- イベントリスナー(DOM) ---

// --- イベントリスナー(コントラクト) ---
function watchDepositEvent(contractAddress) {
  var depositEvent = PiggyBankContract.at(contractAddress).Deposit();
  depositEvent.watch(function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
    updateBalance(contractAddress);
  });
}

function watchDestroyEvent(contractAddress) {
  var destroyEvent = PiggyBankContract.at(contractAddress).Destroy();
  destroyEvent.watch(function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
    localStorage.removeItem(contractAddress);
    $(`.${contractAddress}`).remove();
  });
}
// END --- イベントリスナー(コントラクト) ---

// --- 単位の変換に用いる関数 ---
function etherToWei(etherAmount) {
  return web3js.toWei(etherAmount, "ether");
}

function weiToEther(weiAmount) {
  return web3js.fromWei(weiAmount, "ether");
}
// END --- 単位の変換に用いる関数 ---

// 画面を開いた時に呼ばれ、ローカルストレージから存在する貯金箱を読み込み表示
async function startApp() {
  for (piggyBankInstanceAddress in localStorage) {
    if (piggyBankInstanceAddress.length < 40) {
      // ローカルストレージの他のいろいろも取ってきてしまうためフィルタリング
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

    // 残高、目標額を取得してDOMに埋め込む
    updateBalance(piggyBankInstanceAddress);
    updateGoalAmount(piggyBankInstanceAddress);

    // それぞれのコントラクトに対してイベントリスナーを登録
    watchDepositEvent(piggyBankInstanceAddress);
    watchDestroyEvent(piggyBankInstanceAddress);
  }
}
// END --- 画面を開いた時に呼ばれ、ローカルストレージから存在する貯金箱を読み込み表示 ---

// --- コントラクトに対して処理をする ---
// 貯金する
function deposit(fromAddress, toAddress, ethAmount) {
  // トランザクションオブジェクトを作成
  txObject = { from: fromAddress, to: toAddress, value: etherToWei(ethAmount) };

  PiggyBankContract.at(toAddress).deposit.sendTransaction(txObject, function(
    err,
    result
  ) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
  });
}

// 貯金箱を破壊してお金を取り出す
function destroy(userAddress, contractAddress) {
  PiggyBankContract.at(contractAddress).destroy({ from: userAddress }, function(
    err,
    result
  ) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
  });
}

// 新しい貯金箱を作成する
function createPiggyBank(msgSender, goalEthAmount) {
  PiggyBankContract.new(
    etherToWei(goalEthAmount),
    {
      data: PiggyBankBytecode,
      from: msgSender,
      gas: 3000000
    },
    function(err, piggyBankInstance) {
      if (err) {
        alert(err);
        return;
      }
      if (!piggyBankInstance.address) {
        console.log(piggyBankInstance.transactionHash);
        return;
      }
      piggyBankInstanceAddress = piggyBankInstance.address;
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
      watchDepositEvent(piggyBankInstanceAddress);
      watchDestroyEvent(piggyBankInstanceAddress);
      localStorage.setItem(piggyBankInstanceAddress, msgSender);
    }
  );
}
// END --- コントラクトに対して処理をする ---

// --- コントラクトの情報を取得する ---
// 貯金額の更新
function updateBalance(contractAddress) {
  web3js.eth.getBalance(contractAddress, function(err, balance) {
    if (err) {
      alert(err);
      return;
    }
    $(`.${contractAddress} .saving-amount`).text(balance.c[0] / 10000); // よくわからん単位で返ってくる
  });
}

// 目標額の読み込み
function updateGoalAmount(contractAddress) {
  PiggyBankContract.at(contractAddress).goalAmount(function(err, amount) {
    if (err) {
      alert(err);
      return;
    }
    $(`.${contractAddress} .goal-amount`).text(amount.c[0] / 10000); // よくわからん単位で返ってくる
  });
}
// END --- コントラクトの情報を取得する ---
