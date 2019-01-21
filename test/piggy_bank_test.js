// TODO: 新しいコントラクトに対応したテストの記述

// var PiggyBank = artifacts.require("./PiggyBank.sol");

// contract("PiggyBank", async accounts => {
//   it("should deposit correctly", async () => {
//     let piggyBank = await PiggyBank.deployed();

//     await piggyBank.deposit.sendTransaction({
//       from: accounts[0],
//       to: piggyBank.address,
//       value: 10000
//     });

//     contractBalance = await web3.eth.getBalance(piggyBank.address);

//     assert.equal(contract1Balance, 10000);
//   });

//   it("should not deposit for another account", async () => {
//     try {
//       let piggyBank = await PiggyBank.deployed();
//       firstBalance = await web3.eth.getBalance(accounts[0]);
//       await piggyBank.deposit.sendTransaction({
//         from: accounts[1],
//         to: piggyBank.address,
//         value: 10000
//       });
//     } catch (e) {
//       // 違うアカウントからの貯金は受け取られないのでエラーが発生する
//       assert.ok(e);
//     }
//   });

//   it("should destroy correctly", async () => {
//     let piggyBank = await PiggyBank.deployed();

//     await piggyBank.deposit.sendTransaction({
//       from: accounts[0],
//       to: piggyBank.address,
//       value: 200000000000000000
//     });
//     let firstBalance = await web3.eth.getBalance(accounts[0]);

//     await piggyBank.destroy({ from: accounts[0] });

//     let secondBalance = await web3.eth.getBalance(accounts[0]);

//     assert.ok(firstBalance < secondBalance);
//   });

//   it("should not destroy if saving amount is insufficient", async () => {
//     try {
//       let piggyBank = await PiggyBank.deployed();
//       await piggyBank.deposit.sendTransaction({
//         from: accounts[0],
//         to: piggyBank.address,
//         value: 2000000000000000
//       });
//     } catch (e) {
//       // 目標額に達していないのでエラーが発生する
//       assert.ok(e);
//     }
//   });
// });
