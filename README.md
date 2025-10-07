# QR Code Generator + MCP

A standalone QR code generator with beautiful styling options and Model Context Protocol (MCP) integration.

## Features

### Web App
- 10 pre-designed style presets
- Mobile-responsive design
- Custom logo upload support
- Export as SVG or PNG
- Logo positioning options (center, bottom-right)
- Dark/Light/System theme switcher
- Interactive sound effects with toggle control
- Built with Next.js 15 and React 19
- Full Kalypso design system styling

### MCP Integration
- AI-powered QR code generation via Claude Desktop & Cursor
- HTTP and stdio transport support
- Access all 10 style presets programmatically
- No browser needed - generate QR codes directly from AI tools
- Hosted endpoint or local deployment options

## Getting Started

### Web App

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the QR code generator.

#### Build

```bash
npm run build:next
npm start
```

### MCP Server

#### Quick Start with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "qr-tool": {
      "url": "https://qr-tool-mcp.vercel.app/api/mcp"
    }
  }
}
```

Restart Claude Desktop and you can now generate QR codes with AI!

**Example usage:**
```
Generate a QR code for https://instagram.com/kalypsodesigns using the neon-pulse style
```

#### Local MCP Server Development

```bash
npm run build:mcp
npm run start:mcp
```

For detailed setup instructions:
- [Claude Desktop Setup Guide](./CLAUDE_DESKTOP_SETUP.md)
- [Cursor IDE Setup Guide](./CURSOR_SETUP.md)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── qr-generator/       # QR code generator feature
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components (button, input, etc.)
│   │   └── mobile-tool-wrapper.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── package.json
```

## Available Scripts

### Web App
- `npm run dev` - Start development server
- `npm run build:next` - Build Next.js app for production
- `npm start` - Start production server

### MCP Server
- `npm run build:mcp` - Build MCP server
- `npm run start:mcp` - Start MCP server (stdio mode)
- `npm run build` - Build both web app and MCP server

### Code Quality
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome
- `npm run type-check` - Run TypeScript type checking

## Technologies

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **next-themes** - Theme management
- **Motion** - Smooth animations

### MCP Server
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **Zod** - Schema validation
- **jsdom** - Headless DOM for server-side QR generation
- **qr-code-styling** - QR code generation

### Code Quality
- **Biome** - Linting and formatting
- **Husky** - Git hooks
- **TypeScript** - Type safety

## MCP Tools

### `generate_qr_code`
Generate a styled QR code with custom options.

**Parameters:**
- `url` (required) - The URL or text to encode
- `style` (optional) - Style preset ID (default: "slate-ember")
- `format` (optional) - "svg" or "png" (default: "svg")
- `size` (optional) - Dimensions 256-2048px (default: 768)
- `logoPosition` (optional) - "center" or "bottom-right"

### `get_available_styles`
List all available QR code style presets with color schemes.

### `preview_qr_url`
Generate a shareable web preview URL for customization.

## Available Styles

1. **slate-ember** - Dark slate with orange accent (default)
2. **ink-lime** - Deep black with lime green
3. **charcoal-cyan** - Navy charcoal with cyan
4. **night-sky** - Midnight blue with sky blue
5. **graphite-gold** - Dark graphite with gold
6. **espresso-rose** - Dark brown with rose pink
7. **plum-ice** - Deep purple with lavender
8. **forest-mint** - Forest green with mint
9. **cocoa-orange** - Warm brown with orange
10. **mono-high** - High contrast black & white

## License

MIT License - see [LICENSE](./LICENSE) file for details.
