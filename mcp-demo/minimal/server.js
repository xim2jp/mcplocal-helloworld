#!/usr/bin/env node

/**
 * 世界最小のMCPサーバー - MCP SDK実装版
 * 
 * このサーバーはModel Context Protocol (MCP)の公式SDKを使用しており、
 * Claude Desktopと通信してツールを提供します。
 * 
 * MCPプロトコルの仕組み:
 * 1. Claude Desktop がstdio経由でJSON-RPCリクエストを送信
 * 2. サーバーがリクエストを処理してレスポンスを返す
 * 3. 通信は行ベースのJSON形式
 * 
 * SDKを使用することで、JSON-RPC通信の詳細は隠蔽され、
 * より簡潔で保守性の高いコードになります。
 */

// MCP SDK からサーバークラスをインポート
// これが手動実装でのprocess.stdinハンドリングなどを代替
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

// stdio通信用のトランスポートクラスをインポート
// これが手動実装でのstdio設定やバッファリングを代替
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// リクエスト/レスポンススキーマをインポート
// これにより型安全なリクエストハンドリングが可能
import {
  CallToolRequestSchema,      // tools/call リクエスト用
  ListToolsRequestSchema,     // tools/list リクエスト用
} from "@modelcontextprotocol/sdk/types.js";

// MCPサーバーインスタンスを作成
// 第1引数: サーバー情報（手動実装のserverInfoと同等）
// 第2引数: サーバー機能の宣言（手動実装のinitialize レスポンスと同等）
const server = new Server({
  name: "minimal-mcp-server",        // サーバー名（一意である必要がある）
  version: "1.0.0",                 // サーバーバージョン
}, {
  capabilities: {                    // 対応機能を宣言
    tools: {},                       // ツール機能を有効化
  },
});

/**
 * tools/list リクエストのハンドラを設定
 * 
 * 手動実装での以下の部分と同等:
 * case "tools/list":
 *   return { jsonrpc: "2.0", id, result: { tools } };
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [                                              // このサーバーが提供するツールの定義
      {
        name: "hello_world",                           // ツール名（一意である必要がある）
        description: "Hello World!を返すシンプルなツール", // ツールの説明
        inputSchema: {                                 // 入力パラメータのJSONスキーマ
          type: "object",                           // オブジェクト型
          properties: {},                           // プロパティなし（引数不要）
          required: [],                             // 必須パラメータなし
        },
      },
    ],
  };
});

/**
 * tools/call リクエストのハンドラを設定
 * 
 * 手動実装での以下の部分と同等:
 * case "tools/call":
 *   return handleToolCall(id, params);
 * 
 * @param {Object} request - ツール実行リクエスト
 * @param {Object} request.params - リクエストパラメータ
 * @param {string} request.params.name - 実行するツール名
 * @returns {Object} ツール実行結果
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;                        // 実行するツール名を取得

  // ツール名に基づいて処理を分岐
  if (name === "hello_world") {
    // hello_worldツールの実行
    // 手動実装と同じ形式のレスポンスを返す
    return {
      content: [                                        // MCPでは結果はcontent配列で返す
        {
          type: "text",                               // コンテンツタイプ（text, image, etc.）
          text: "Hello World!",                       // 実際のテキスト内容
        },
      ],
    };
  } else {
    // 未知のツール名の場合はエラーを投げる
    // SDKが自動的にJSON-RPCエラーレスポンスに変換
    throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * サーバーを起動するメイン関数
 * 
 * 手動実装での以下の部分と同等:
 * - process.stdin.setEncoding('utf8');
 * - process.stdin.on('data', ...);
 * - すべてのプロトコルハンドリング
 */
async function main() {
  // stdio通信用のトランスポートを作成
  // これが手動実装でのstdin/stdout処理を代替
  const transport = new StdioServerTransport();
  
  // サーバーをトランスポートに接続
  // この時点でClaude Desktopからの接続を待機開始
  // 内部でinitialize/initializedハンドシェイクも自動処理
  await server.connect(transport);
  
  // サーバー起動メッセージ（stderr に出力してstdoutのJSON-RPC通信を妨害しない）
  // 手動実装と同じ考慮事項
  console.error("Minimal MCP server running on stdio");
}

/**
 * メイン関数を実行し、エラーハンドリングを行う
 * 
 * 手動実装での以下の部分と同等:
 * process.stdin.on('error', ...);
 * process.stdin.on('end', ...);
 */
main().catch((error) => {
  console.error("Server failed:", error);
  process.exit(1);                                        // プロセスを異常終了
});