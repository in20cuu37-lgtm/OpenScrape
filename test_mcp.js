const { spawn } = require('child_process');

const mcpProcess = spawn('node', ['mcp-server.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'inherit']
});

let responses = [];

mcpProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Received:', output.trim());
  responses.push(output.trim());
});

mcpProcess.on('close', (code) => {
  console.log('MCP process exited with code', code);
  console.log('All responses:', responses);
});

setTimeout(() => {
  console.log('Sending initialize...');
  mcpProcess.stdin.write('{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n');

  setTimeout(() => {
    console.log('Sending scrape_page...');
    mcpProcess.stdin.write('{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"scrape_page","arguments":{"url":"https://snowbasestudio.com"}}}\n');

    setTimeout(() => {
      mcpProcess.stdin.end();
    }, 5000);  // Wait longer for scraping to complete
  }, 1000);
}, 1000);
