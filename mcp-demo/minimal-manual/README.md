# 世界最小のMCPサーバー（手動実装版）

Hello World!を返すだけの最小限のMCPサーバーの手動JSON-RPC実装版です。

## 特徴

- 外部依存関係なし（純粋なNode.js）
- JSON-RPCプロトコルを手動実装
- MCPプロトコルの仕組みが理解しやすい

## 構成ファイル

- `package.json` - Node.jsプロジェクトの設定（依存関係なし）
- `server.js` - JSON-RPC手動実装によるMCPサーバー
- `README.md` - このファイル

## セットアップ

1. フォルダに移動:
```bash
cd /home/s-noguchi/mcplocal-helloworld/mcp-demo/minimal-manual
```

2. サーバーを実行（依存関係のインストール不要）:
```bash
npm start
```

## Claude Desktopでの設定

Claude Desktopの設定ファイル(`claude_desktop_config.json`)に以下を追加:

```json
{
  "mcpServers": {
    "minimal-manual": {
      "command": "node",
      "args": ["/home/s-noguchi/mcplocal-helloworld/mcp-demo/minimal-manual/server.js"],
      "env": {}
    }
  }
}
```

## 使用方法

1. Claude Desktopを再起動
2. チャットで「hello_worldツールを使って」と入力
3. "Hello World!"が返されます

## 手動実装の仕組み

この実装では以下のJSON-RPCメッセージを処理します:

### 1. initialize
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {}
}
```

### 2. tools/list
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

### 3. tools/call
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "hello_world"
  }
}
```

## コード構造

1. **入力処理**: `process.stdin`でJSON-RPCメッセージを受信
2. **リクエスト処理**: `handleRequest()`でメソッドをルーティング
3. **レスポンス送信**: `process.stdout`でJSON-RPCレスポンスを送信
4. **エラーハンドリング**: 標準JSON-RPCエラーコードを使用

## SDK版との比較

- **手動版**: プロトコルの詳細が見える、依存関係なし
- **SDK版**: 簡潔、保守性高い、プロトコル準拠保証

学習には手動版、実用には SDK版がおすすめです。