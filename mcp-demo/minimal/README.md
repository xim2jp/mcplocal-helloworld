# 世界最小のMCPサーバー

Hello World!を返すだけの最小限のMCPサーバーです。

## 構成ファイル

- `package.json` - Node.jsプロジェクトの設定
- `server.js` - MCPサーバーのメイン実装
- `README.md` - このファイル

## セットアップ

1. 依存関係をインストール:
```bash
cd /home/s-noguchi/mcplocal-helloworld/mcp-demo/minimal
npm install
```

2. サーバーをテスト実行:
```bash
npm start
```

## Claude Desktopでの設定

Claude Desktopの設定ファイル(`claude_desktop_config.json`)に以下を追加:

### macOS
ファイル場所: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
ファイル場所: `%APPDATA%\Claude\claude_desktop_config.json`

### Linux
ファイル場所: `~/.config/Claude/claude_desktop_config.json`

設定内容:
```json
{
  "mcpServers": {
    "minimal-hello": {
      "command": "node",
      "args": ["/home/s-noguchi/mcplocal-helloworld/mcp-demo/minimal/server.js"],
      "env": {}
    }
  }
}
```

**注意**: パスは実際の環境に合わせて変更してください。

## 使用方法

1. Claude Desktopを再起動
2. チャットで「hello_worldツールを使って」と入力
3. "Hello World!"が返されます

## MCPサーバーの仕組み

このサーバーは以下の要素で構成されています:

1. **サーバーインスタンス**: MCPプロトコルを処理
2. **ツール定義**: `hello_world`ツールの説明
3. **ツール実行**: リクエストに対してレスポンスを返す
4. **通信**: stdio経由でClaude Desktopと通信

## カスタマイズ

新しいツールを追加する場合:
1. `ListToolsRequestSchema`ハンドラーにツール定義を追加
2. `CallToolRequestSchema`ハンドラーにツール実行ロジックを追加