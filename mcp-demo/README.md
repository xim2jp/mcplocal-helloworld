# MCP Server Demo - Complete Implementation

これは、JSON-RPCベースのMCP（Model Context Protocol）サーバーの完全な実装例です。tools、resources、protocolの3つの主要機能をすべて実装しています。

## 概要

このMCPサーバーは以下の機能を提供します：

### 🛠️ Tools（ツール）
- **hello** - "hello world"を返す
- **echo** - 入力されたメッセージをエコーバック
- **add** - 2つの数値を加算

### 📦 Resources（リソース）
- **hello://world** - シンプルなテキストリソース
- **hello://info** - サーバー情報のJSONリソース

### 🔧 Protocol（プロトコル）
- JSON-RPC 2.0ベースの通信
- プロトコルバージョン: 2024-11-05
- 標準MCPメソッドの実装

## 必要な環境

- Node.js (v14以降推奨)

## セットアップ手順

### 1. プロジェクトのクローンまたは作成

```bash
# ディレクトリを作成
mkdir mcp-demo
cd mcp-demo

# ファイルを配置
```

### 2. 実行権限の付与

```bash
chmod +x server.js
chmod +x test-client.js
chmod +x test-pretty.js
```

## 🧪 テスト方法

### 基本的なテスト

```bash
# シンプルなテストクライアントで全機能をテスト
node test-client.js | node server.js
```

### 見やすい形式でのテスト

```bash
# フォーマットされた出力でテスト
node test-pretty.js
```

### 個別のリクエストテスト

```bash
# 初期化
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node server.js

# ツール一覧
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node server.js

# リソース一覧
echo '{"jsonrpc":"2.0","id":3,"method":"resources/list","params":{}}' | node server.js
```

## 📋 利用可能なメソッド

### 1. initialize
サーバーを初期化し、プロトコルバージョンと機能を取得

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "your-client",
      "version": "1.0.0"
    }
  }
}
```

### 2. tools/list
利用可能なツールの一覧を取得

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

### 3. tools/call
ツールを実行

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": {
      "message": "Hello, MCP!"
    }
  }
}
```

### 4. resources/list
利用可能なリソースの一覧を取得

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/list",
  "params": {}
}
```

### 5. resources/read
リソースの内容を読み取り

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/read",
  "params": {
    "uri": "hello://world"
  }
}
```

## 🔌 Claude Desktopとの連携

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

## 📂 ファイル構成

```
mcp-demo/
├── server.js        # MCPサーバー本体（JSON-RPC実装）
├── test-client.js   # テスト用クライアント（全機能テスト）
├── test-pretty.js   # 見やすい形式でのテストスクリプト
└── README.md        # このファイル
```

## 🏗️ アーキテクチャ

### JSON-RPC通信

MCPサーバーはJSON-RPC 2.0プロトコルを使用：
- リクエスト: `{"jsonrpc":"2.0","id":1,"method":"...","params":{...}}`
- レスポンス: `{"jsonrpc":"2.0","id":1,"result":{...}}`
- エラー: `{"jsonrpc":"2.0","id":1,"error":{...}}`

### メッセージフロー

1. クライアントがJSON-RPCリクエストを標準入力に送信
2. サーバーがリクエストをパースして処理
3. サーバーがJSON-RPCレスポンスを標準出力に送信
4. 各メッセージは改行文字で区切られる

## 🚀 拡張のアイデア

### 新しいツールの追加

```javascript
// tools配列に新しいツールを追加
{
    name: "greet",
    description: "Greets a person by name",
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Person's name"
            }
        },
        required: ["name"]
    }
}
```

### 新しいリソースの追加

```javascript
// resources配列に新しいリソースを追加
{
    uri: "hello://time",
    name: "Current Time",
    description: "Returns the current time",
    mimeType: "text/plain"
}
```

### エラーハンドリングの強化

- より詳細なエラーコード
- カスタムエラーメッセージ
- バリデーションの追加

## 🐛 トラブルシューティング

### サーバーが起動しない場合

1. **Node.jsのインストール確認**
   ```bash
   node --version
   ```

2. **ファイルパスの確認**
   ```bash
   pwd
   ls -la *.js
   ```

3. **実行権限の確認**
   ```bash
   ls -l server.js
   chmod +x server.js
   ```

### JSON-RPCエラーが発生する場合

1. **リクエストフォーマットの確認**
   - `jsonrpc`フィールドが`"2.0"`であること
   - `id`フィールドが存在すること
   - `method`が正しいこと

2. **パラメータの確認**
   - 必須パラメータがすべて含まれているか
   - データ型が正しいか

## 📚 参考リンク

- [MCP仕様](https://spec.modelcontextprotocol.io/)
- [JSON-RPC 2.0仕様](https://www.jsonrpc.org/specification)

## ライセンス

このサンプルコードはMITライセンスで提供されています。