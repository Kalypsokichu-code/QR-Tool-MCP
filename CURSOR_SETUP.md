# Cursor IDE Setup Guide

This guide will help you integrate the QR Tool MCP server with Cursor IDE.

## Prerequisites

- Cursor IDE installed
- MCP support enabled in Cursor

## Setup

### 1. Configure MCP Server

Add the QR Tool MCP server to your Cursor configuration:

**Location:** `.cursor/mcp.json` in your project root, or global Cursor settings

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

### 2. Restart Cursor

After adding the configuration, restart Cursor IDE to load the MCP server.

## Available Tools

### 1. `generate_qr_code`
Generate a styled QR code with custom options.

**Parameters:**
- `url` (required) - The URL or text to encode
- `style` (optional) - Style preset ID (default: "slate-ember")
- `format` (optional) - "svg" or "png" (default: "svg")
- `size` (optional) - Dimensions in pixels 256-2048 (default: 768)
- `logoPosition` (optional) - "center" or "bottom-right"

**Available Styles:**
- `slate-ember` (default)
- `ink-lime`
- `charcoal-cyan`
- `night-sky`
- `graphite-gold`
- `espresso-rose`
- `plum-ice`
- `forest-mint`
- `cocoa-orange`
- `mono-high`

### 2. `get_available_styles`
Get a list of all available style presets with their color schemes.

### 3. `preview_qr_url`
Generate a shareable web preview URL for a QR code.

## Example Usage

### Generate QR Code
```
Generate a QR code for https://github.com/yourname using the night-sky style
```

### Batch Generation
```
Create QR codes for all the URLs in my markdown file, 
using different styles for each
```

### Get Styles First
```
First show me all available QR code styles, 
then generate one for https://example.com
```

### Save to File
```
Generate a QR code for https://mywebsite.com and save it as qr-code.svg
```

## Integration Patterns

### 1. Documentation Generation
Automatically generate QR codes for all URLs in your documentation:

```
Read through my README.md and create QR codes for all external links, 
saving them in a /qr-codes directory
```

### 2. Marketing Assets
Create QR codes for social media profiles:

```
Generate QR codes for:
- Instagram: https://instagram.com/brand
- Twitter: https://twitter.com/brand  
- Website: https://brand.com

Use the graphite-gold style and size 1024
```

### 3. Dynamic Asset Pipeline
Include in your build process:

```
For each product in products.json, generate a QR code 
pointing to its product page URL
```

## Troubleshooting

**MCP server not connecting?**
- Verify the URL in your config is correct
- Check your internet connection
- Ensure Cursor has the latest MCP support

**Generated QR codes not working?**
- Verify the URL format is correct
- Try using a different style
- Check the console for error messages

## Advanced Configuration

### Custom Deployment

If you've deployed your own instance:

```json
{
  "mcpServers": {
    "qr-tool": {
      "url": "https://your-custom-domain.com/api/mcp"
    }
  }
}
```

### Local Development

For local testing with your own changes:

```json
{
  "mcpServers": {
    "qr-tool": {
      "command": "node",
      "args": ["/path/to/qr-tool-mcp/dist/mcp/index.js"]
    }
  }
}
```

## Support

For issues or feature requests:
https://github.com/Kalypsokichu-code/qr-tool-mcp/issues
