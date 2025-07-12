#!/usr/bin/env node

// MCP Server - JSON-RPC Implementation
// This server implements the MCP protocol with tools, resources, and protocol info

// Set encoding for stdin to handle text data
process.stdin.setEncoding('utf8');

// Buffer to handle partial JSON messages
let buffer = '';

// Server capabilities
const serverInfo = {
    name: "hello-mcp-server",
    version: "0.1.0",
    protocolVersion: "2024-11-05"
};

// Available tools
const tools = [
    {
        name: "hello",
        description: "Says hello world",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "echo", 
        description: "Echoes back the input message",
        inputSchema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Message to echo back"
                }
            },
            required: ["message"]
        }
    },
    {
        name: "add",
        description: "Adds two numbers",
        inputSchema: {
            type: "object",
            properties: {
                a: {
                    type: "number",
                    description: "First number"
                },
                b: {
                    type: "number", 
                    description: "Second number"
                }
            },
            required: ["a", "b"]
        }
    }
];

// Available resources
const resources = [
    {
        uri: "hello://world",
        name: "Hello World Resource",
        description: "A simple hello world resource",
        mimeType: "text/plain"
    },
    {
        uri: "hello://info",
        name: "Server Info",
        description: "Information about this MCP server",
        mimeType: "application/json"
    }
];

// Handle JSON-RPC requests
function handleRequest(request) {
    try {
        const { jsonrpc, id, method, params } = request;
        
        // Validate JSON-RPC version
        if (jsonrpc !== "2.0") {
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32600,
                    message: "Invalid Request",
                    data: "JSON-RPC version must be 2.0"
                }
            };
        }

        // Route to appropriate handler
        switch (method) {
            case "initialize":
                return handleInitialize(id, params);
            case "tools/list":
                return handleListTools(id);
            case "tools/call":
                return handleCallTool(id, params);
            case "resources/list":
                return handleListResources(id);
            case "resources/read":
                return handleReadResource(id, params);
            default:
                return {
                    jsonrpc: "2.0",
                    id,
                    error: {
                        code: -32601,
                        message: "Method not found",
                        data: `Unknown method: ${method}`
                    }
                };
        }
    } catch (error) {
        return {
            jsonrpc: "2.0",
            id: request.id || null,
            error: {
                code: -32603,
                message: "Internal error",
                data: error.message
            }
        };
    }
}

// Handle initialize request
function handleInitialize(id, params) {
    return {
        jsonrpc: "2.0",
        id,
        result: {
            protocolVersion: serverInfo.protocolVersion,
            capabilities: {
                tools: {},
                resources: {}
            },
            serverInfo
        }
    };
}

// Handle list tools request
function handleListTools(id) {
    return {
        jsonrpc: "2.0",
        id,
        result: {
            tools
        }
    };
}

// Handle tool call request
function handleCallTool(id, params) {
    const { name, arguments: args } = params;
    
    switch (name) {
        case "hello":
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
        case "echo":
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    content: [
                        {
                            type: "text",
                            text: args.message || ""
                        }
                    ]
                }
            };
        case "add":
            const sum = (args.a || 0) + (args.b || 0);
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    content: [
                        {
                            type: "text",
                            text: `${args.a} + ${args.b} = ${sum}`
                        }
                    ]
                }
            };
        default:
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32602,
                    message: "Invalid params",
                    data: `Unknown tool: ${name}`
                }
            };
    }
}

// Handle list resources request
function handleListResources(id) {
    return {
        jsonrpc: "2.0",
        id,
        result: {
            resources
        }
    };
}

// Handle read resource request
function handleReadResource(id, params) {
    const { uri } = params;
    
    switch (uri) {
        case "hello://world":
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    contents: [
                        {
                            uri,
                            mimeType: "text/plain",
                            text: "Hello, World! This is a simple MCP resource."
                        }
                    ]
                }
            };
        case "hello://info":
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    contents: [
                        {
                            uri,
                            mimeType: "application/json",
                            text: JSON.stringify(serverInfo, null, 2)
                        }
                    ]
                }
            };
        default:
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32602,
                    message: "Invalid params",
                    data: `Unknown resource: ${uri}`
                }
            };
    }
}

// Send response
function sendResponse(response) {
    const message = JSON.stringify(response) + '\n';
    process.stdout.write(message);
}

// Handle incoming data from stdin
process.stdin.on('data', (data) => {
    // Add data to buffer
    buffer += data.toString();
    
    // Process complete lines
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    // Process each complete line as a JSON-RPC request
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        try {
            const request = JSON.parse(trimmed);
            const response = handleRequest(request);
            sendResponse(response);
        } catch (error) {
            // Send parse error
            sendResponse({
                jsonrpc: "2.0",
                id: null,
                error: {
                    code: -32700,
                    message: "Parse error",
                    data: error.message
                }
            });
        }
    });
});

// Handle errors
process.stdin.on('error', (err) => {
    console.error('Error reading from stdin:', err);
});

// Handle stdin close
process.stdin.on('end', () => {
    console.error('stdin closed');
    process.exit(0);
});

// Log startup message to stderr
console.error('MCP Server started. Waiting for JSON-RPC requests...');