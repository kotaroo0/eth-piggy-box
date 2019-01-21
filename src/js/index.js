var PiggyBankInstance;
var web3js;

// --- イベントリスナー(DOM) ---
window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
    PiggyBankInstance = web3js.eth.contract(PiggyBankABI).at(PiggyBankAddress);
    console.log("Launched!");
    startApp(); // DOMの初期化
    watchCreateEvent();
    watchDepositEvent();
    watchDestroyEvent();
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
    create(userAccount, goalAmount);
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
    var id = targetPiggyBank.find(".id").text(); // 貯金先のアドレス
    var ethAmount = targetPiggyBank.find(".amount").val(); // Etherの送付量
    deposit(ownerAddress, id, ethAmount);
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
    var id = targetPiggyBank.find(".id").text(); // 破壊する貯金箱のアドレス
    let savingAmount = $(`.${id} .saving-amount`).text();
    let goalAmount = $(`.${id} .goal-amount`).text();
    if (savingAmount < goalAmount) {
      alert("Insufficient Amount!");
      return;
    }
    destroy(ownerAddress, id);
  });
});
// END --- イベントリスナー(DOM) ---

// --- イベントリスナー(コントラクト) ---
function watchCreateEvent() {
  var createEvent = PiggyBankInstance.Create();
  createEvent.watch(function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    let id = result.args["id"].c[0];
    let owner = result.args["userAddress"];
    let goalAmount = result.args["goalAmount"].c[0] / 10000;
    $(".container").append(
      `<div class=\"piggy-bank ${id} d-inline-block m-2\">\
          <div class=\"card\" style=\"width: 20rem;\">\
            <img class=\"card-img-top\" src=\"img/piggy_bank.png\">\
            <div class=\"card-body\">\
              <p class=\"card-text\">PiggyBankId: <span class=\"id\">${id}</span></p>\
              <p class=\"card-text\">Owner Address: <span class=\"owner-address\">${owner}</span></p>\
              <p class=\"card-text\">Saving Amount: <span class=\"saving-amount\">0</span></p>\
              <p class=\"card-text\">Goal Amount: <span class=\"goal-amount\">${goalAmount}</span></p>\
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
    localStorage.setItem(
      id,
      JSON.stringify({ owner: owner, savingAmount: 0, goalAmount: goalAmount })
    );
  });
}

function watchDepositEvent() {
  var depositEvent = PiggyBankInstance.Deposit();
  depositEvent.watch(function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
    let id = result.args["id"].c[0];
    let owner = result.args["userAddress"];
    let savingAmount = result.args["savingAmount"].c[0] / 10000;
    let goalAmount = result.args["goalAmount"].c[0] / 10000;
    $(`.${id} .saving-amount`).text(savingAmount); // よくわからん単位で返ってくる
    localStorage.setItem(
      id,
      JSON.stringify({
        owner: owner,
        savingAmount: savingAmount,
        goalAmount: goalAmount
      })
    );
  });
}

function watchDestroyEvent() {
  var destroyEvent = PiggyBankInstance.Destroy();
  destroyEvent.watch(function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    console.log(result);
    let id = result.args["id"].c[0];
    $(`.${id}`).remove();
    localStorage.removeItem(id);
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
function startApp() {
  for (id in localStorage) {
    if (isNaN(id) || id.length > 10) {
      // ローカルストレージの他のいろいろも取ってきてしまうためフィルタリング
      continue;
    }
    let data = JSON.parse(localStorage.getItem(id));
    $(".container").append(
      `<div class=\"piggy-bank ${id} d-inline-block m-2\">\
        <div class=\"card\" style=\"width: 20rem;\">\
          <img class=\"card-img-top\" src=\"img/piggy_bank.png\">\
          <div class=\"card-body\">\
            <p class=\"card-text\">Contract Address: <span class=\"contract-address\">${id}</span></p>\
            <p class=\"card-text\">Owner Address: <span class=\"owner-address\">${
              data["owner"]
            }</span></p>\
            <p class=\"card-text\">Saving Amount: <span class=\"saving-amount\">${
              data["savingAmount"]
            }</span></p>\
            <p class=\"card-text\">Goal Amount: <span class=\"goal-amount\">${
              data["goalAmount"]
            }</span></p>\
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
  }
}
// END --- 画面を開いた時に呼ばれ、ローカルストレージから存在する貯金箱を読み込み表示 ---

// --- コントラクトに対して処理をする ---
// 新しい貯金箱を作成する
function create(userAddress, goalAmount) {
  PiggyBankInstance.create.sendTransaction(
    etherToWei(goalAmount),
    { from: userAddress },
    function(err, result) {
      if (err) {
        alert(err);
        return;
      }
      console.log(result);
    }
  );
}

// 貯金する
function deposit(fromAddress, id, ethAmount) {
  // トランザクションオブジェクトを作成
  txObject = {
    from: fromAddress,
    to: PiggyBankAddress,
    value: etherToWei(ethAmount)
  };

  PiggyBankInstance.deposit.sendTransaction(id, txObject, function(
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
function destroy(userAddress, id) {
  PiggyBankInstance.destroy.sendTransaction(id, { from: userAddress }, function(
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
// END --- コントラクトに対して処理をする ---
