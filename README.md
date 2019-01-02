# ETH貯金箱

truffleでコントラクト実装、ローカルネット作成、ビルド、テストを行なった。

## 実行方法

今回の開発でのバージョンについて
```
$ truffle version
Truffle v5.0.0 (core: 5.0.0)\
Solidity - ^0.4.25 (solc-js)\
Node v8.9.4
```

truffleでローカルネットワークを作成
```
$ truffle develop
Truffle Develop started at http://127.0.0.1:9545/
```

ローカルサーバーを起動する
```
$ cd src
$ php -S localhost:8080 ( python -m SimpleHTTPServer 8080 )
```
phpやpythonを利用したのは一例。

Metamaskでローカルネットを登録したり、秘密鍵をコピーしてアカウントを登録したりする。

localhost:8080にMetamaskを登録しているブラウザで開く。

貯金目標額を入力して、貯金箱を作成する。

貯金を行なったり、貯金箱を破壊することができる。

## ディレクトリ構成
/build コントラクトのコードがビルドされたものがある\
/contracts コントラクトの記述がある\
/src フロント側のファイルがある\
/test 簡単なテストがある

## スクリーンショット
<img width="1679" alt="screen shot 2019-01-01 at 17 32 03" src="https://user-images.githubusercontent.com/31947384/50571348-61c09f00-0deb-11e9-988a-a2968c993183.png">
