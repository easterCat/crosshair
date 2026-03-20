# CrosshairOverlay

A lightweight, cross-platform crosshair overlay app for games. Built with Tauri v2 + React + TypeScript.

## Features

- **15 built-in presets**: Cross, dot, circle, delta, diamond, bracket, gap-cross, and more
- **Fully customizable**: Color, size, thickness, opacity, rotation, gap, outline
- **Pulse animation**: Optional breathing/pulse effect on any preset
- **Custom presets**: Save unlimited custom crosshairs
- **Global hotkeys**:
  - `F9` — Show/hide crosshair
  - `F10` — Show/hide settings window
  - `F11` — Next preset
  - `F12` — Previous preset
- **System tray**: Minimize to tray, right-click menu
- **Always on top**: Crosshair floats above fullscreen games
- **Click-through**: Transparent areas pass mouse events through
- **Cross-platform**: Windows, macOS (Intel + Apple Silicon), Linux

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Tauri v2 |
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS 4 |
| State | @tauri-apps/plugin-store |
| Hotkeys | @tauri-apps/plugin-global-shortcut |
| Rendering | HTML5 Canvas |

## Dev Setup

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run tauri dev

# Build for production
npm run tauri build
```

## Project Structure

```
crosshair-overlay/
├── src/                      # React frontend
│   ├── components/
│   │   ├── CrosshairCanvas.tsx   # Canvas-based crosshair rendering
│   │   ├── PresetList.tsx        # Preset grid with thumbnails
│   │   └── SettingsPanel.tsx     # Full customization UI
│   ├── hooks/
│   │   ├── usePresets.ts         # Preset CRUD + persistence
│   │   ├── useHotkeys.ts         # Global hotkey registration
│   │   └── useTray.ts            # System tray integration
│   ├── types/
│   │   └── crosshair.ts          # TypeScript types + built-in presets
│   ├── App.tsx                   # Settings window entry
│   ├── CrosshairOverlayApp.tsx   # Overlay window entry
│   └── overlay-entry.tsx         # Overlay renderer
├── src-tauri/                 # Rust backend
│   ├── src/
│   │   ├── lib.rs               # Commands + setup
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
└── .github/workflows/          # CI/CD (macOS / Windows / Linux)
```

## Architecture

The app uses **two Tauri windows**:

1. **Settings window** (`main`) — The settings UI with preset list and customization panel
2. **Overlay window** (`crosshair-layer`) — A fullscreen transparent always-on-top window that renders the crosshair at screen center

Communication: The settings window emits `overlay-update` events via Tauri IPC to sync preset changes to the overlay window in real time.

## License

MIT
