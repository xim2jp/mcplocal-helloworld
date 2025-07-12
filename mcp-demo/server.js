#!/usr/bin/env node

// Simple MCP Server - Standard I/O Example
// This server reads from stdin and writes to stdout

// Set encoding for stdin to handle text data
process.stdin.setEncoding('utf8');

// Buffer to handle partial lines
let buffer = '';

// Handle incoming data from stdin
process.stdin.on('data', (data) => {
    // Add data to buffer
    buffer += data.toString();
    
    // Process complete lines
    const lines = buffer.split('\n');
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() || '';
    
    // Process each complete line
    lines.forEach(line => {
        const input = line.trim();
        
        // Skip empty lines
        if (!input) return;
        
        // Simple command handling
        if (input.toLowerCase() === 'hello') {
            // Send response to stdout
            process.stdout.write('hello world\n');
        } else if (input.toLowerCase() === 'exit') {
            // Gracefully exit
            process.stdout.write('Goodbye!\n');
            process.exit(0);
        } else {
            // Echo back any other input
            process.stdout.write(`Echo: ${input}\n`);
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

// Log startup message to stderr (not stdout, to avoid interfering with protocol)
console.error('MCP Server started. Listening on stdin...');