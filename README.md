# QR Code Generator

A standalone QR code generator with beautiful styling options, based on the Kalypso design system.

## Features

- 🎨 10 pre-designed style presets
- 📱 Mobile-responsive design
- 🖼️ Custom logo upload support
- 💾 Export as SVG or PNG
- 🎯 Logo positioning options (center, bottom-right)
- 🌓 Dark/Light/System theme switcher
- 🔊 Interactive sound effects with toggle control
- ⚡ Built with Next.js 15 and React 19
- 🎨 Full Kalypso design system styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the QR code generator.

### Build

```bash
npm run build
npm start
```

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome
- `npm run type-check` - Run TypeScript type checking

## Technologies

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Biome** - Linting and formatting
- **qr-code-styling** - QR code generation
- **Radix UI** - Accessible components
- **next-themes** - Theme management
- **Motion** - Smooth animations

## License

Private
