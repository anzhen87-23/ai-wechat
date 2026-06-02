# AnWeChat

一个仿微信的全平台即时通讯应用。

## 功能特性

- **实时聊天** - 基于 Socket.IO 的即时消息传递
- **好友管理** - 搜索、添加、删除好友
- **用户资料** - 昵称、微信号、个性签名
- **多端支持** - Web、iOS/Android (React Native)、Windows/Mac (Electron)
- **会话列表** - 最近联系人和最后消息预览
- **认证系统** - 手机号/邮箱注册登录，JWT 持久化

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Client Applications                    │
├──────────────┬──────────────────┬────────────────────────┤
│   Web (Vite) │ Mobile (Expo)    │ Desktop (Electron)     │
│   React 18   │ React Native     │ Electron + Web Build   │
└──────┬───────┴────────┬─────────┴──────────────┬─────────┘
       │                │                         │
       │  HTTP + Socket.IO                       │
       ▼                ▼                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Koa + Node.js)                 │
│  REST API  │  Socket.IO  │  JWT Auth  │  better-sqlite3  │
└─────────────────────────────────────────────────────────┘
```

## 快速开始

### 安装

```bash
npm install
```

### 开发

```bash
# 同时启动后端和Web前端
npm run dev

# 单独启动各端
npm run dev:server   # Backend http://localhost:3001
npm run dev:web      # Web http://localhost:5173
npm run dev:mobile   # Mobile (Expo)
npm run dev:desktop  # Desktop (Electron)
```

### 构建

```bash
npm run build:web           # Web production build
npm run build:desktop:win   # Windows installer (.exe)
npm run build:desktop:mac   # Mac installer (.dmg)
```

### 测试

```bash
npm run test:e2e            # Run all E2E tests
npx playwright test --ui    # Interactive test UI
npx playwright show-report  # View test report
```

## 项目结构

| 目录 | 说明 |
|------|------|
| `packages/server/` | 后端 API 服务 (Koa + SQLite + Socket.IO) |
| `packages/web/` | Web 前端 (React + Vite) |
| `packages/mobile/` | 移动端 (React Native + Expo) |
| `packages/desktop/` | 桌面端 (Electron) |
| `packages/shared/` | 共享代码 (API常量、事件名) |
| `e2e/` | Playwright E2E 测试 |
| `docs/` | 技术文档 |

## 文档

- [技术文档](docs/TECHNICAL.md) - 架构、数据库、部署
- [API文档](docs/API.md) - REST API 和 Socket.IO 事件
- [测试文档](docs/TESTING.md) - 测试结构和运行方式

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Koa, better-sqlite3, JWT, Socket.IO |
| Web | React 18, Vite, React Router |
| 移动端 | React Native 0.76, Expo 52, React Navigation 6 |
| 桌面端 | Electron 33, electron-builder 25 |
| 测试 | Playwright 1.60 |

## License

MIT
