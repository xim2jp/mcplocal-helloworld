# Minimal MCP Server

MCP（Model Context Protocol）の3つのコア機能を実装した最小限のサーバーです。

## 📌 MCPの3つの主要機能

### 1. 🛠️ Tools（ツール）
外部アクションやコマンドを実行する機能
- 例：計算、ファイル操作、API呼び出しなど

### 2. 📦 Resources（リソース）
データやファイルを提供する機能
- 例：設定ファイル、ドキュメント、データベース内容など

### 3. � Prompts（プロンプト）
再利用可能なプロンプトテンプレートを提供する機能
- 例：定型的な質問、タスクのテンプレートなど

## 🚀 クイックスタート

### 1. セットアップ

```bash
# 実行権限を付与
chmod +x server.js
chmod +x test-minimal.js
```

### 2. サーバーのテスト

```bash
# 最小限のテストを実行
node test-minimal.js
```

### 3. 手動でのテスト

```bash
# サーバーを起動して、個別にコマンドを送信
node server.js

# 別のターミナルで以下のコマンドを実行：
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node server.js
```

## 📋 実装内容

### Tools
- **hello** - "hello world"を返すシンプルなツール

### Resources  
- **hello://message** - 基本的なテキストメッセージ

### Prompts
- **greeting** - 名前を受け取って挨拶プロンプトを生成

## � API リファレンス

### Initialize（初期化）
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

### Tools（ツール機能）

#### ツール一覧取得
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

#### ツール実行
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "hello",
    "arguments": {}
  }
}
```

### Resources（リソース機能）

#### リソース一覧取得
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/list",
  "params": {}
}
```

#### リソース読み取り
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/read",
  "params": {
    "uri": "hello://message"
  }
}
```

### Prompts（プロンプト機能）

#### プロンプト一覧取得
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "prompts/list",
  "params": {}
}
```

#### プロンプト取得
```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "prompts/get",
  "params": {
    "name": "greeting",
    "arguments": {
      "name": "Alice"
    }
  }
}
```

## 🔧 Claude Desktopでの使用

1. **Settings → Developer Settings**を開く
2. **Custom MCP Server Command**に以下を入力：
   ```
   node /workspace/mcp-demo/server.js
   ```
3. Claude Desktopを再起動

## 📂 ファイル構成

```
mcp-demo/
├── server.js         # 最小限のMCPサーバー実装
├── test-minimal.js   # 3つの機能をテストするスクリプト
└── README.md         # このファイル
```

## � このサーバーの特徴

- **最小限の実装** - MCPの3つのコア機能のみ
- **学習に最適** - シンプルで理解しやすい
- **拡張可能** - 新しいツール、リソース、プロンプトを簡単に追加

## � 拡張例

### 新しいツールの追加

```javascript
tools.push({
    name: "calculate",
    description: "Simple calculator",
    inputSchema: {
        type: "object",
        properties: {
            expression: {
                type: "string",
                description: "Math expression to evaluate"
            }
        },
        required: ["expression"]
    }
});
```

### 新しいリソースの追加

```javascript
resources.push({
    uri: "config://settings",
    name: "Configuration",
    description: "Application settings",
    mimeType: "application/json"
});
```

### 新しいプロンプトの追加

```javascript
prompts.push({
    name: "code_review",
    description: "Code review template",
    arguments: [
        {
            name: "language",
            description: "Programming language",
            required: true
        }
    ]
});
```

## 📚 参考資料

- [MCP仕様](https://spec.modelcontextprotocol.io/)
- [MCP SDKドキュメント](https://github.com/modelcontextprotocol/sdk)

## ライセンス

MIT License