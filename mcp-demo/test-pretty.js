#!/usr/bin/env node

// Pretty test script for MCP Server
// This script formats the server responses for better readability

const { spawn } = require('child_process');
const path = require('path');

// Spawn the server
const server = spawn('node', ['server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Test requests
const tests = [
    {
        name: "Initialize",
        request: {
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
        }
    },
    {
        name: "List Tools",
        request: {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
        }
    },
    {
        name: "List Resources",
        request: {
            jsonrpc: "2.0",
            id: 3,
            method: "resources/list",
            params: {}
        }
    },
    {
        name: "Call Hello Tool",
        request: {
            jsonrpc: "2.0",
            id: 4,
            method: "tools/call",
            params: {
                name: "hello",
                arguments: {}
            }
        }
    },
    {
        name: "Call Echo Tool",
        request: {
            jsonrpc: "2.0",
            id: 5,
            method: "tools/call",
            params: {
                name: "echo",
                arguments: {
                    message: "Testing echo functionality!"
                }
            }
        }
    },
    {
        name: "Call Add Tool",
        request: {
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
        }
    },
    {
        name: "Read Hello World Resource",
        request: {
            jsonrpc: "2.0",
            id: 7,
            method: "resources/read",
            params: {
                uri: "hello://world"
            }
        }
    },
    {
        name: "Read Server Info Resource",
        request: {
            jsonrpc: "2.0",
            id: 8,
            method: "resources/read",
            params: {
                uri: "hello://info"
            }
        }
    }
];

let currentTest = 0;
let responses = '';

// Handle server output
server.stdout.on('data', (data) => {
    responses += data.toString();
    
    // Try to parse complete JSON responses
    const lines = responses.split('\n');
    responses = lines.pop() || '';
    
    lines.forEach(line => {
        if (!line.trim()) return;
        
        try {
            const response = JSON.parse(line);
            console.log(`\n=== ${tests[currentTest].name} ===`);
            console.log('Response:', JSON.stringify(response, null, 2));
            currentTest++;
            
            // Send next test
            if (currentTest < tests.length) {
                sendRequest(tests[currentTest].request);
            } else {
                // All tests complete
                console.log('\n✅ All tests completed!');
                server.stdin.end();
            }
        } catch (error) {
            console.error('Failed to parse response:', line);
        }
    });
});

// Handle server errors
server.stderr.on('data', (data) => {
    console.error('Server:', data.toString().trim());
});

// Send a request to the server
function sendRequest(request) {
    server.stdin.write(JSON.stringify(request) + '\n');
}

// Start tests
console.log('🚀 Starting MCP Server Tests...\n');
sendRequest(tests[0].request);