@'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"scrape_page","arguments":{"url":"https://snowbasestudio.com","selectors":{"title":"h1, title","description":"meta[name=\"description\"]","content":"p, div"}}}}}
'@ | node mcp-server.js
