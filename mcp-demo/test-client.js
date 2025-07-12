#!/usr/bin/env node

// Test client for MCP Server
// This script sends JSON-RPC requests to test the server

const requests = [
    // Initialize
    {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "test-client",
                version: "0.1.0"
            }
        }
    },
    
    // List tools
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
    },
    
    // List resources
    {
        jsonrpc: "2.0",
        id: 3,
        method: "resources/list",
        params: {}
    },
    
    // Call hello tool
    {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
            name: "hello",
            arguments: {}
        }
    },
    
    // Call echo tool
    {
        jsonrpc: "2.0",
        id: 5,
        method: "tools/call",
        params: {
            name: "echo",
            arguments: {
                message: "Testing echo functionality!"
            }
        }
    },
    
    // Call add tool
    {
        jsonrpc: "2.0",
        id: 6,
        method: "tools/call",
        params: {
            name: "add",
            arguments: {
                a: 5,
                b: 3
            }
        }
    },
    
    // Read hello world resource
    {
        jsonrpc: "2.0",
        id: 7,
        method: "resources/read",
        params: {
            uri: "hello://world"
        }
    },
    
    // Read server info resource
    {
        jsonrpc: "2.0",
        id: 8,
        method: "resources/read",
        params: {
            uri: "hello://info"
        }
    }
];

// Send all requests
requests.forEach(request => {
    console.log(JSON.stringify(request));
});