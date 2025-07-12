#!/usr/bin/env node

// Minimal MCP Server - JSON-RPC Implementation
// Implements the three core MCP features: tools, resources, and prompts

process.stdin.setEncoding('utf8');

// Buffer for handling partial JSON messages
let buffer = '';

// Server information
const serverInfo = {
    name: "minimal-mcp-server",
    version: "0.1.0"
};

// 1. Tools - Actions the server can perform
const tools = [
    {
        name: "hello",
        description: "Says hello world",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }
];

// 2. Resources - Data the server can provide
const resources = [
    {
        uri: "hello://message",
        name: "Hello Message",
        description: "A simple hello world message",
        mimeType: "text/plain"
    }
];

// 3. Prompts - Prompt templates the server can provide
const prompts = [
    {
        name: "greeting",
        description: "A greeting prompt template",
        arguments: [
            {
                name: "name",
                description: "Name to greet",
                required: true
            }
        ]
    }
];

// Handle JSON-RPC requests
function handleRequest(request) {
    try {
        const { jsonrpc, id, method, params } = request;
        
        // Basic validation
        if (jsonrpc !== "2.0") {
            return createError(id, -32600, "Invalid Request");
        }

        // Route to appropriate handler
        switch (method) {
            case "initialize":
                return {
                    jsonrpc: "2.0",
                    id,
                    result: {
                        protocolVersion: "2024-11-05",
                        capabilities: {
                            tools: {},
                            resources: {},
                            prompts: {}
                        },
                        serverInfo
                    }
                };

            case "tools/list":
                return {
                    jsonrpc: "2.0",
                    id,
                    result: { tools }
                };

            case "tools/call":
                return handleToolCall(id, params);

            case "resources/list":
                return {
                    jsonrpc: "2.0",
                    id,
                    result: { resources }
                };

            case "resources/read":
                return handleResourceRead(id, params);

            case "prompts/list":
                return {
                    jsonrpc: "2.0",
                    id,
                    result: { prompts }
                };

            case "prompts/get":
                return handlePromptGet(id, params);

            default:
                return createError(id, -32601, "Method not found");
        }
    } catch (error) {
        return createError(request.id || null, -32603, "Internal error", error.message);
    }
}

// Handle tool execution
function handleToolCall(id, params) {
    const { name } = params;
    
    if (name === "hello") {
        return {
            jsonrpc: "2.0",
            id,
            result: {
                content: [
                    {
                        type: "text",
                        text: "hello world"
                    }
                ]
            }
        };
    }
    
    return createError(id, -32602, "Invalid params", `Unknown tool: ${name}`);
}

// Handle resource reading
function handleResourceRead(id, params) {
    const { uri } = params;
    
    if (uri === "hello://message") {
        return {
            jsonrpc: "2.0",
            id,
            result: {
                contents: [
                    {
                        uri,
                        mimeType: "text/plain",
                        text: "Hello, World! This is a minimal MCP resource."
                    }
                ]
            }
        };
    }
    
    return createError(id, -32602, "Invalid params", `Unknown resource: ${uri}`);
}

// Handle prompt retrieval
function handlePromptGet(id, params) {
    const { name, arguments: args } = params;
    
    if (name === "greeting") {
        const userName = args?.name || "User";
        return {
            jsonrpc: "2.0",
            id,
            result: {
                description: "Greeting prompt",
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Please greet ${userName} in a friendly way.`
                        }
                    }
                ]
            }
        };
    }
    
    return createError(id, -32602, "Invalid params", `Unknown prompt: ${name}`);
}

// Create error response
function createError(id, code, message, data = undefined) {
    const error = {
        jsonrpc: "2.0",
        id,
        error: {
            code,
            message
        }
    };
    if (data !== undefined) {
        error.error.data = data;
    }
    return error;
}

// Send response
function sendResponse(response) {
    process.stdout.write(JSON.stringify(response) + '\n');
}

// Handle incoming data
process.stdin.on('data', (data) => {
    buffer += data.toString();
    
    // Process complete lines
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        try {
            const request = JSON.parse(trimmed);
            const response = handleRequest(request);
            sendResponse(response);
        } catch (error) {
            sendResponse(createError(null, -32700, "Parse error", error.message));
        }
    });
});

// Handle errors and exit
process.stdin.on('error', (err) => {
    console.error('Error:', err);
});

process.stdin.on('end', () => {
    process.exit(0);
});

// Log startup to stderr
console.error('Minimal MCP Server started. Ready for JSON-RPC requests.');