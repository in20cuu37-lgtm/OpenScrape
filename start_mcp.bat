@echo off
cd /d "%~dp0"
start /B node mcp-server.js
echo MCP server started in background.
pause
