## サーバ設定，方法
### Cloud Model
・On premises
・Infrastructure(as a Service)
・Platform(as a Service)
・Software(as a Service)

### AzureでのVM作成方法
仮想マシン作成より仮想マシン名，地域，イメージ，料金を決める．
またキーの保存もする．
そのご受信ポートの設定を行い，Webで使う場合はHTTP，HTTPSなどのプロトコルを設定し作成完了．
最後にSSHのキーを保存

### 接続方法
ssh -i キーの場所 ユーザ名@Ipアドレス  

ssh -i ~/Downloads/myKey.pem azureuser@10.111.12.123
のように実行すると警告としてunprotected private key file!という文字がコマンドプロンプトにひょうじされます．
これは秘密鍵のファイルの権限が緩いことが問題で，SSHによって鍵を読み込まないようにしているためです
これをchmod 400 ファイルディレクトリとしてファイル所有者のみ読み書きできる状態にしてから接続します

### Ubuntuのアップデートと初期設定
```$ sudo apt install```でいろいろな言語の学習環境を導入できる

その後```$ sudo apt install apache2```でwebサーバの作成ができる


### 台本
まずは```
$ sudo apt update
$ sudo apt upgrade
```を実行します．
これは・apt(Advanced Package Tool)
Linuxで使われるパッケージ管理システム．パッケージのインストール，アップグレード削除などを簡単に使うためのもの．
の現在の確認とupdateによって得られた最新情報を元にアップデートを行うものです

次にサーバでコードを実行するための言語環境を入れます
c言語の場合は
```$ sudo apt install gcc```で

Javaの場合は
```$ sudo apt install openjdk-11-jdk```

最後にサーバにNode.jsをインストールします．これによりサーバサイドでもJavascriptを実行することができるようになります
```$ apt show nodejs```でインストールのバージョンを確認
```$ sudo curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - でnode.js```講師人の擬行が提供しているインストールを効率的に実行できるスクリプトを使用し
```$ sudo apt install nodejs -y ```でnodejsをインストールする


またWebサーバでhttpリクエストを処理するためにapache2と呼ばれるUbuntu 上で動き、HTTP通信による Web サービス（Web ページ配信など）を実現するミドルウェアを
```$ sudo apt install apache2　```でインストールします

これらの作業によりサーバを作成した時にUbuntuというOS，また言語環境を導入できる．
