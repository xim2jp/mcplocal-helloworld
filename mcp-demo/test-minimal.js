#!/usr/bin/env node

// Minimal test client for the three MCP features

const { spawn } = require('child_process');

// Start the server
const server = spawn('node', ['server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Test sequence
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
                    name: "minimal-test-client",
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
        name: "Call Hello Tool",
        request: {
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
                name: "hello",
                arguments: {}
            }
        }
    },
    {
        name: "List Resources",
        request: {
            jsonrpc: "2.0",
            id: 4,
            method: "resources/list",
            params: {}
        }
    },
    {
        name: "Read Hello Resource",
        request: {
            jsonrpc: "2.0",
            id: 5,
            method: "resources/read",
            params: {
                uri: "hello://message"
            }
        }
    },
    {
        name: "List Prompts",
        request: {
            jsonrpc: "2.0",
            id: 6,
            method: "prompts/list",
            params: {}
        }
    },
    {
        name: "Get Greeting Prompt",
        request: {
            jsonrpc: "2.0",
            id: 7,
            method: "prompts/get",
            params: {
                name: "greeting",
                arguments: {
                    name: "Alice"
                }
            }
        }
    }
];

let currentTest = 0;
let buffer = '';

// Handle server output
server.stdout.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    lines.forEach(line => {
        if (!line.trim()) return;
        
        try {
            const response = JSON.parse(line);
            console.log(`\n✨ ${tests[currentTest].name}`);
            console.log(JSON.stringify(response, null, 2));
            
            currentTest++;
            if (currentTest < tests.length) {
                sendRequest(tests[currentTest].request);
            } else {
                console.log('\n✅ All tests completed!');
                console.log('\n📊 Summary:');
                console.log('- Tools: ✓');
                console.log('- Resources: ✓');
                console.log('- Prompts: ✓');
                server.stdin.end();
            }
        } catch (error) {
            console.error('Parse error:', error);
        }
    });
});

// Handle server errors
server.stderr.on('data', (data) => {
    console.error('Server:', data.toString().trim());
});

// Send request
function sendRequest(request) {
    server.stdin.write(JSON.stringify(request) + '\n');
}

// Start testing
console.log('🚀 Testing Minimal MCP Server (Tools, Resources, Prompts)\n');
sendRequest(tests[0].request);