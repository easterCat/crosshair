# CrosshairOverlay

[English](#english) · [中文](#中文)

---

## English

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
│   ├── i18n/                     # Internationalization (EN/ZH)
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

---

## 中文

一款轻量级跨平台游戏准星悬浮窗应用。基于 Tauri v2 + React + TypeScript 构建。

## 功能特性

- **15 个内置预设**：十字、中心点、圆环、三角、菱形、括号、间隙十字等
- **完全可自定义**：颜色、大小、粗细、透明度、旋转角度、间隙、描边
- **脉冲动画**：可为任意预设开启呼吸/闪烁动效
- **自定义预设**：可保存无限数量的自定义准星
- **全局快捷键**：
  - `F9` — 显示/隐藏准星
  - `F10` — 显示/隐藏设置窗口
  - `F11` — 下一个预设
  - `F12` — 上一个预设
- **系统托盘**：最小化到托盘，右键菜单
- **始终置顶**：准星悬浮于全屏游戏之上
- **点击穿透**：透明区域不拦截鼠标事件
- **跨平台**：Windows、macOS（Intel + Apple Silicon）、Linux

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Tauri v2 |
| 前端 | React 19 + TypeScript + Vite 8 |
| 样式 | Tailwind CSS 4 |
| 状态持久化 | @tauri-apps/plugin-store |
| 全局快捷键 | @tauri-apps/plugin-global-shortcut |
| 渲染 | HTML5 Canvas |

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载）
npm run tauri dev

# 构建生产版本
npm run tauri build
```

## 项目结构

```
crosshair-overlay/
├── src/                      # React 前端
│   ├── components/
│   │   ├── CrosshairCanvas.tsx   # 基于 Canvas 的准星渲染
│   │   ├── PresetList.tsx        # 预设网格缩略图
│   │   └── SettingsPanel.tsx     # 完整自定义设置 UI
│   ├── hooks/
│   │   ├── usePresets.ts         # 预设 CRUD + 持久化
│   │   ├── useHotkeys.ts         # 全局快捷键注册
│   │   └── useTray.ts            # 系统托盘集成
│   ├── i18n/                     # 国际化（英文/中文）
│   ├── types/
│   │   └── crosshair.ts          # TypeScript 类型 + 内置预设
│   ├── App.tsx                   # 设置窗口入口
│   ├── CrosshairOverlayApp.tsx   # 悬浮窗入口
│   └── overlay-entry.tsx         # 悬浮窗渲染器
├── src-tauri/                 # Rust 后端
│   ├── src/
│   │   ├── lib.rs               # 命令 + 初始化
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
└── .github/workflows/          # CI/CD（macOS / Windows / Linux）
```

## 架构设计

应用使用**两个 Tauri 窗口**：

1. **设置窗口** (`main`) — 包含预设列表和自定义设置面板的 UI 界面
2. **悬浮窗口** (`crosshair-layer`) — 全屏透明置顶窗口，在屏幕中心渲染准星

通信方式：设置窗口通过 Tauri IPC 发送 `overlay-update` 事件，实时同步预设变更到悬浮窗口。

## 开源协议

MIT
