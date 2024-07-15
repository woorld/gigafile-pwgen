<div align="center">
  <img src="https://github.com/woorld/gigafile-pwgen/assets/17719812/970cb615-94a1-4f36-9aa3-106539dc19c3">
  <h1>ギガファイル便DLパスジェネレーター</h1>
  <p>ギガファイル便ページにDLパスを生成・設定するボタンを追加するChrome拡張機能です。</p>
</div>

## インストール

### Chrome ウェブストアからインストールする場合

[こちら](https://chromewebstore.google.com/detail/%E3%82%AE%E3%82%AC%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E4%BE%BFdl%E3%83%91%E3%82%B9%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC/kkoljllilbdfgfceichpnkhnjngahjcm)からインストールできます。

### ソースをビルドしたものをインストールする場合

以下の手順で手動でのインストールが可能です。

1. 当リポジトリをクローン
2. `npm install`で必要なパッケージをインストール
3. `npm run pack`で製品ビルドのZIPファイルを生成
4. Chromeで`chrome://extensions`にアクセスし、3.で`/pack`に生成されたZIPファイルをドラッグ&ドロップしてインストール

## 主な機能

### パスワードの生成・設定

![image](https://github.com/woorld/gigafile-pwgen/assets/17719812/8797af80-3529-49fc-a5a3-a0ba1760d67c)

ファイルのアップロード完了後、「PW生成・設定」ボタンを押すことでパスワードの生成と設定を一括で行います。

![image](https://github.com/woorld/gigafile-pwgen/assets/17719812/c18e3c5b-7ccc-4714-9b4f-377d1b6bd4ea)

複数ファイルをアップロード後、「パスワード付きでまとめる」ボタンを押すことで、まとめたファイルにパスワードを生成・設定することが可能です。

### ダウンロードURLと設定したパスワードのコピー

「PW生成・設定」ボタン、「パスワード付きでまとめる」ボタンを押下時、そのファイルのダウンロードURLとパスワードを以下のフォーマットでクリップボードにコピーします。

アップロードしたファイルを共有する際に便利です。

```
https://XX.gigafile.nu/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ダウンロードパスワード：XXXX
```

## npmスクリプト

### `build`

リリース用の設定でビルドします。

### `build:dev`

開発用の設定でビルドします。

### `watch`

ファイルの監視を開始します。（webpack --watch）

監視中にファイルが変更された場合、自動的に再度ビルドを行います。

### `pack`

リリース用の設定でビルドを行い（`build`コマンドの実行）、生成された製品ビルドをZIPファイルにして`/pack`に格納します。

## ブランチ運用

当リポジトリでは、以下の方式で各ブランチを運用しています。

### main

- リリース前にdevelopをマージする
- リリース用ファイルのビルド、タグの作成はこのブランチで行う
  - タグは`vX.Y.Z`の形式で作成

### develop

- 各featureブランチをマージする
- リリース前の軽微な変更（`package.json`, `manifest.json`のバージョン変更など）を適用する

### feature

- 各Issueから作成する
- ブランチ名は`[Issue番号]-[ブランチ内で適用する変更・修正の英語表記（kebab-case）]`の形式で作成

## プルリクエストの運用

当リポジトリでは、以下のプルリクエストの作成・運用を行っています。

- 命名は`Resolve: [対象Issue名] [対象Issue番号]`の形式で行う
- 対象Issueと同じラベルを付ける

アップデートを行うプルリクエストは、以下に沿って作成します。

- プルリクエスト名を`[vX.Y.Z]にアップデート`にする
- `update`ラベルを付ける
