# Claude Desktop Setup Guide

This guide will help you integrate the QR Tool MCP server with Claude Desktop.

## Prerequisites

- Claude Desktop app installed
- Node.js 18+ installed

## Setup Options

### Option 1: HTTP Transport (Recommended for Quick Start)

Add this configuration to your Claude Desktop config file:

**macOS/Linux:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Configuration:**
```json
{
  "mcpServers": {
    "qr-tool": {
      "url": "https://qr-tool-mcp.vercel.app/api/mcp"
    }
  }
}
```

### Option 2: Local stdio Transport (For Development)

1. Clone and build the project:
   ```bash
   git clone https://github.com/Kalypsokichu-code/qr-tool-mcp
   cd qr-tool-mcp
   npm install
   npm run build:mcp
   ```

2. Add this configuration to your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "qr-tool": {
         "command": "node",
         "args": [
           "/absolute/path/to/qr-tool-mcp/dist/mcp/index.js"
         ]
       }
     }
   }
   ```

   **Important:** Replace `/absolute/path/to/qr-tool-mcp` with your actual project path.

3. **Restart Claude Desktop** after updating the config.

## Available Tools

Once configured, you'll have access to these tools in Claude Desktop:

### 1. `generate_qr_code`
Generate a styled QR code with custom options.

**Example usage:**
```
Generate a QR code for https://instagram.com/kalypsodesigns 
using the neon-pulse style
```

### 2. `get_available_styles`
List all available QR code style presets.

**Example usage:**
```
Show me all available QR code styles
```

### 3. `preview_qr_url`
Get a shareable web preview URL.

**Example usage:**
```
Create a preview link for a QR code pointing to https://example.com
```

## Verification

To verify the setup:

1. Restart Claude Desktop
2. Start a new conversation
3. Ask: "What tools do you have access to?"
4. You should see the QR Tool MCP tools listed

## Troubleshooting

**Tools not appearing?**
- Ensure you restarted Claude Desktop after config changes
- Check that the config JSON is valid (no trailing commas)
- For local setup: verify the absolute path is correct

**Errors when using tools?**
- For HTTP transport: check your internet connection
- For local setup: ensure `npm run build:mcp` completed successfully
- Check Claude Desktop logs for error messages

## Support

For issues or questions, please open an issue on GitHub:
https://github.com/Kalypsokichu-code/qr-tool-mcp/issues
