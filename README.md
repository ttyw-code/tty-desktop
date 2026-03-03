# TTY Desktop / 五子棋桌面应用

一个基于 Electron + Vite + React + TypeScript 的桌面应用示例工程，包含五子棋、番茄钟、Todo 等页面。

A desktop app sample built with Electron + Vite + React + TypeScript, including Gomoku, Pomodoro, Todo, and other demo pages.

## 功能特性 / Features

- Electron 主进程与渲染进程分离
- React + TypeScript 渲染层
- Vite 构建主进程与前端页面
- Tailwind CSS（含 HeroUI）样式体系
- 示例模块：Gomoku AI、Pomodoro、Todo、IPC Demo、LowDB Worker

- Separated Electron main and renderer processes
- React + TypeScript renderer
- Vite for both main-process and renderer builds
- Tailwind CSS (with HeroUI)
- Demo modules: Gomoku AI, Pomodoro, Todo, IPC Demo, LowDB worker

## 环境要求 / Requirements

- Node.js 18+（推荐 20+）
- npm 9+（或兼容版本）
- Windows / macOS / Linux

- Node.js 18+ (20+ recommended)
- npm 9+ (or compatible)
- Windows / macOS / Linux

## 安装依赖 / Install

```bash
npm install
```

如果你在中国大陆网络环境遇到 Electron 下载失败，可先设置镜像：

If Electron download fails (common in mainland China), set mirror first:

**PowerShell**

```powershell
$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'
npm install
```

**bash**

```bash
export ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'
npm install
```

## 本地开发 / Development

```bash
npm run dev
```

说明 / Notes:
- 会同时启动 Vite 开发服务和 Electron。
- 默认等待渲染服务地址：`http://localhost:5175`

- Starts Vite dev server and Electron together.
- Default renderer dev URL: `http://localhost:5175`

## 生产构建与运行 / Build & Start

```bash
npm run build
npm run start
```

## 打包 / Package

```bash
npm run pack:win
npm run pack:nsis
npm run pack:msi
```

## 目录结构 / Project Structure

```text
src/
  main/                 # Electron main process
    db-worker/          # LowDB worker
  renderer/             # Web UI (React)
    src/
      gomoku/           # Gomoku page + AI
      pomodoro/         # Pomodoro page
      todoList/         # Todo page
      basic-page/       # Basic demo page
  common/               # Shared utilities
  base/                 # Core utility primitives
  ipc-demo/             # IPC demo
build/                  # App icons/resources
```

## 常见问题 / Troubleshooting

1. `Unable to handle ...python.exe`（VS Code 提示）
   - 这是 VS Code Python 解释器路径失效引起的，更新 `python.defaultInterpreterPath` 即可。

2. `electron install.js` 下载失败（socket hang up）
   - 设置 `ELECTRON_MIRROR` 后重试安装。

3. 依赖安装异常
   - 删除 `node_modules` 与 `package-lock.json` 后重装。

1. `Unable to handle ...python.exe` in VS Code
   - Caused by stale Python interpreter path; update `python.defaultInterpreterPath`.

2. `electron install.js` download fails (`socket hang up`)
   - Retry after setting `ELECTRON_MIRROR`.

3. Dependency install issues
   - Remove `node_modules` and `package-lock.json`, then reinstall.

## License

ISC
