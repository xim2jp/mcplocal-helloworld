#!/usr/bin/env node

/**
 * 世界最小のMCPサーバー - 手動JSON-RPC実装版
 * 
 * このサーバーはModel Context Protocol (MCP)を手動実装しており、
 * Claude Desktopと通信してツールを提供します。
 * 
 * MCPプロトコルの仕組み:
 * 1. Claude Desktop がstdio経由でJSON-RPCリクエストを送信
 * 2. サーバーがリクエストを処理してレスポンスを返す
 * 3. 通信は行ベースのJSON形式
 */

// 標準入力をUTF-8として設定（JSON-RPCメッセージを受信するため）
process.stdin.setEncoding('utf8');

// 不完全なJSON行を蓄積するバッファ
// stdio通信では複数行に渡ってデータが到着する場合があるため
let buffer = '';

// サーバーの基本情報（initializeレスポンスで使用）
const serverInfo = {
    name: "minimal-mcp-server-manual",
    version: "1.0.0"
};

// このサーバーが提供するツールの定義
// MCPでは事前にツールリストを宣言する必要がある
const tools = [
    {
        name: "hello_world",                           // ツール名（一意である必要がある）
        description: "Hello World!を返すシンプルなツール", // ツールの説明
        inputSchema: {                                 // 入力パラメータのJSONスキーマ
            type: "object",                           // オブジェクト型
            properties: {},                           // プロパティなし（引数不要）
            required: []                              // 必須パラメータなし
        }
    }
];

/**
 * JSON-RPCリクエストを処理するメイン関数
 * 
 * @param {Object} request - JSON-RPCリクエストオブジェクト
 * @returns {Object|null} JSON-RPCレスポンスまたはnull（通知の場合）
 */
function handleRequest(request) {
    try {
        // JSON-RPCリクエストから必要なフィールドを抽出
        const { jsonrpc, id, method, params } = request;
        
        // JSON-RPCバージョンチェック（2.0のみサポート）
        if (jsonrpc !== "2.0") {
            return createError(id, -32600, "Invalid Request");
        }

        // メソッド名に基づいてリクエストを振り分け
        switch (method) {
            case "initialize":
                // MCPサーバーの初期化
                // Claude Desktopが接続時に最初に呼び出すメソッド
                return {
                    jsonrpc: "2.0",
                    id,                                    // リクエストIDをそのまま返す
                    result: {
                        protocolVersion: "2024-11-05",     // 対応MCPプロトコルバージョン
                        capabilities: {                    // サーバーの機能を宣言
                            tools: {}                      // ツール機能を有効化
                        },
                        serverInfo                         // サーバー情報
                    }
                };

            case "initialized":
                // 初期化完了通知（レスポンス不要）
                // この通知はinitializeの後にClaude Desktopから送られる
                return null;                               // nullを返すとレスポンスを送信しない

            case "tools/list":
                // 利用可能なツールのリストを返す
                // Claude Desktopがツール一覧を取得する際に呼び出される
                return {
                    jsonrpc: "2.0",
                    id,
                    result: { tools }                      // tools配列をそのまま返す
                };

            case "tools/call":
                // ツールを実際に実行する
                // ユーザーがClaude Desktopでツールを使用した際に呼び出される
                return handleToolCall(id, params);

            default:
                // 未知のメソッドに対するエラー
                return createError(id, -32601, "Method not found");
        }
    } catch (error) {
        // 予期しないエラーが発生した場合
        return createError(request.id || 0, -32603, "Internal error", error.message);
    }
}

/**
 * ツール実行リクエストを処理する関数
 * 
 * @param {string|number} id - リクエストID
 * @param {Object} params - ツール実行パラメータ
 * @returns {Object} ツール実行結果またはエラー
 */
function handleToolCall(id, params) {
    const { name } = params;                              // 実行するツール名を取得
    
    // ツール名に基づいて処理を分岐
    if (name === "hello_world") {
        // hello_worldツールの実行
        return {
            jsonrpc: "2.0",
            id,
            result: {
                content: [                                // MCPでは結果はcontent配列で返す
                    {
                        type: "text",                     // コンテンツタイプ（text, image, etc.）
                        text: "Hello World!"              // 実際のテキスト内容
                    }
                ]
            }
        };
    }
    
    // 未知のツール名の場合はエラーを返す
    return createError(id, -32602, "Invalid params", `Unknown tool: ${name}`);
}

/**
 * JSON-RPCエラーレスポンスを作成する関数
 * 
 * @param {string|number} id - リクエストID
 * @param {number} code - エラーコード（JSON-RPC標準）
 * @param {string} message - エラーメッセージ
 * @param {any} data - 追加のエラー詳細（オプション）
 * @returns {Object} JSON-RPCエラーレスポンス
 */
function createError(id, code, message, data = undefined) {
    const error = {
        jsonrpc: "2.0",
        id: (id !== undefined && id !== null) ? id : 0,   // 無効なIDの場合は0を使用
        error: {
            code,                                         // 標準エラーコード
            message                                       // エラーメッセージ
        }
    };
    
    // 追加データがある場合は含める
    if (data !== undefined) {
        error.error.data = data;
    }
    
    return error;
}

/**
 * JSON-RPCレスポンスをstdoutに送信する関数
 * 
 * @param {Object} response - 送信するレスポンスオブジェクト
 */
function sendResponse(response) {
    // JSON文字列化して改行を付けて標準出力に書き出し
    // Claude Desktopは行ベースでJSON-RPCメッセージを期待している
    process.stdout.write(JSON.stringify(response) + '\n');
}

/**
 * 標準入力からのデータ受信イベントハンドラ
 * Claude DesktopからのJSON-RPCリクエストを処理する
 */
process.stdin.on('data', (data) => {
    // 受信したデータをバッファに追加
    buffer += data.toString();
    
    // 改行でメッセージを分割（複数のJSON-RPCメッセージが含まれる可能性）
    const lines = buffer.split('\n');
    
    // 最後の要素（不完全な行の可能性）をバッファに戻す
    buffer = lines.pop() || '';
    
    // 各完全な行を処理
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;                             // 空行をスキップ
        
        try {
            // JSON文字列をパースしてリクエストオブジェクトに変換
            const request = JSON.parse(trimmed);
            
            // リクエストを処理してレスポンスを生成
            const response = handleRequest(request);
            
            // レスポンスがnullでない場合のみ送信
            // （initialized通知などはレスポンス不要）
            if (response !== null) {
                sendResponse(response);
            }
        } catch (error) {
            // JSONパースエラーの場合は標準エラーレスポンスを送信
            sendResponse(createError(0, -32700, "Parse error", error.message));
        }
    });
});

/**
 * 標準入力エラーハンドラ
 */
process.stdin.on('error', (err) => {
    console.error('Error:', err);
});

/**
 * 標準入力終了ハンドラ
 * Claude Desktopが接続を閉じた際に呼ばれる
 */
process.stdin.on('end', () => {
    process.exit(0);                                      // プロセスを正常終了
});

// サーバー起動メッセージ（stderr に出力してstdoutのJSON-RPC通信を妨害しない）
console.error('Minimal MCP Server (Manual Implementation) started');