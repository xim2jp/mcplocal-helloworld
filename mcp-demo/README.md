# Simple MCP Server Demo

これは標準入出力（stdio）を使用した最小限のMCP（Model Context Protocol）サーバーの実装例です。

## 概要

このMCPサーバーは以下の機能を提供します：
- `hello` と入力すると `hello world` を返す
- `exit` と入力するとサーバーを終了
- その他の入力はそのままエコーバック

## 必要な環境

- Node.js (v14以降推奨)

## セットアップ手順

### 1. プロジェクトのクローンまたは作成

```bash
# ディレクトリを作成
mkdir mcp-demo
cd mcp-demo

# server.jsファイルを作成（または既存のものを使用）
```

### 2. 実行権限の付与

```bash
chmod +x server.js
```

### 3. ローカルでのテスト

```bash
# 直接実行
node server.js

# または
./server.js

# 動作確認：
# - "hello" と入力 → "hello world" が返る
# - "exit" と入力 → サーバーが終了
# - その他の文字列 → "Echo: [入力文字列]" が返る
```

### パイプを使用したテスト

```bash
# 単一コマンドのテスト
echo "hello" | node server.js

# 複数コマンドのテスト
printf "hello\ntest\nexit\n" | node server.js
```

## Claude Desktopとの連携

### 設定手順

1. **Claude Desktopを開く**

2. **開発者設定にアクセス**
   - メニューから `Settings` → `Developer Settings` を選択

3. **MCPサーバーの設定**
   - `Custom MCP Server Command` フィールドに以下を入力：
   ```
   node /workspace/mcp-demo/server.js
   ```
   ※ このパスは実際のserver.jsの場所に合わせて変更してください
   ※ または相対パスで指定することも可能です

4. **Claude Desktopを再起動**
   - 設定を反映させるため、アプリケーションを完全に終了してから再起動

5. **動作確認**
   - 新しい会話を開始
   - MCPサーバーとの通信が確立されているか確認

### トラブルシューティング

#### サーバーが起動しない場合

1. **Node.jsのインストール確認**
   ```bash
   node --version
   ```

2. **ファイルパスの確認**
   ```bash
   # server.jsの絶対パスを確認
   pwd
   ls -la server.js
   ```

3. **実行権限の確認**
   ```bash
   ls -l server.js
   # 実行権限がない場合は付与
   chmod +x server.js
   ```

#### Claude Desktopで認識されない場合

1. **ログの確認**
   - Claude Desktopのコンソールログを確認
   - server.jsのエラーメッセージを確認（stderrに出力される）

2. **パスの確認**
   - 絶対パスを使用しているか確認
   - スペースや特殊文字が含まれていないか確認

## コードの仕組み

### 標準入出力の使用

MCPサーバーは標準入出力を使用してクライアントと通信します：

- **stdin（標準入力）**: クライアントからのコマンドを受信
- **stdout（標準出力）**: クライアントへのレスポンスを送信
- **stderr（標準エラー出力）**: デバッグ情報やエラーメッセージ（プロトコルに影響しない）

### イベント駆動型の処理

```javascript
process.stdin.on('data', (data) => {
    // データ受信時の処理
});
```

Node.jsのイベント駆動型アーキテクチャを使用して、入力があるたびに処理を実行します。

## 拡張のアイデア

1. **より複雑なコマンド処理**
   - JSONフォーマットでのコマンド受信
   - 複数のコマンドの実装

2. **ステート管理**
   - セッション情報の保持
   - コンテキストの維持

3. **エラーハンドリングの強化**
   - より詳細なエラーメッセージ
   - リトライロジック

4. **プロトコルの実装**
   - 実際のMCPプロトコル仕様に準拠
   - バージョンネゴシエーション
   - 認証機能

## ライセンス

このサンプルコードはMITライセンスで提供されています。