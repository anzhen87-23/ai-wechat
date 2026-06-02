# AnWeChat

AnWeChat 是一个仿微信的即时通讯应用，支持 Web、移动端（React Native）、桌面端（Electron for Windows/Mac）。

## 技术栈

| 模块 | 技术 |
|------|------|
| 后端 | Koa + better-sqlite3 + JWT + Socket.IO |
| Web端 | React 18 + Vite + React Router |
| 移动端 | React Native + Expo + React Navigation |
| 桌面端 | Electron (复用Web端构建产物) |
| 测试 | Playwright (E2E) |
| 实时通信 | Socket.IO |

## 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 同时启动后端和Web前端
npm run dev

# 或单独启动
npm run dev:server   # 后端 (http://localhost:3001)
npm run dev:web      # Web前端 (http://localhost:5173)
npm run dev:mobile   # 移动端 (Expo Dev Server)
npm run dev:desktop  # 桌面端 (Electron)
```

### 构建

```bash
npm run build:web          # 构建Web
npm run build:desktop      # 构建桌面端
npm run build:desktop:win  # 构建Windows安装包
npm run build:desktop:mac  # 构建Mac安装包
```

### 运行测试

```bash
npm run test:e2e   # 运行Playwright E2E测试
```

## 项目结构

```
an-wechat/
├── package.json                    # Root workspace 配置
├── playwright.config.ts            # Playwright测试配置
├── packages/
│   ├── server/                     # 后端 API 服务
│   │   ├── src/
│   │   │   ├── index.js            # 入口文件 (Koa + Socket.IO)
│   │   │   ├── db.js               # SQLite数据库 (Schema定义)
│   │   │   ├── middleware/auth.js  # JWT认证中间件
│   │   │   ├── routes/             # REST API路由
│   │   │   │   ├── auth.js         # 注册/登录
│   │   │   │   ├── users.js        # 用户搜索/详情
│   │   │   │   ├── contacts.js     # 好友管理
│   │   │   │   ├── messages.js     # 消息历史
│   │   │   │   └── profile.js      # 个人资料
│   │   │   └── socket/chat.js      # Socket.IO实时聊天
│   │   └── package.json
│   ├── web/                        # Web前端
│   │   ├── src/
│   │   │   ├── main.jsx            # 入口
│   │   │   ├── App.jsx             # 根组件
│   │   │   ├── api.js              # API客户端
│   │   │   ├── auth/AuthProvider.jsx # 认证上下文
│   │   │   ├── pages/              # 页面组件
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ChatPage.jsx    # 主聊天页
│   │   │   ├── components/         # 通用组件
│   │   │   │   ├── ChatList.jsx    # 会话列表
│   │   │   │   ├── ContactList.jsx # 通讯录
│   │   │   │   ├── MessageView.jsx # 消息视图
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── ProfilePanel.jsx
│   │   │   └── styles/index.css    # 全局样式
│   │   └── package.json
│   ├── mobile/                     # React Native移动端
│   │   ├── App.tsx                 # 根组件
│   │   ├── app.json                # Expo配置
│   │   ├── src/
│   │   │   ├── api.ts              # API客户端
│   │   │   ├── auth/AuthContext.tsx # 认证上下文
│   │   │   └── screens/            # 屏幕组件
│   │   │       ├── LoginScreen.tsx
│   │   │       ├── RegisterScreen.tsx
│   │   │       ├── ChatListScreen.tsx
│   │   │       ├── ChatScreen.tsx
│   │   │       ├── ContactsScreen.tsx
│   │   │       ├── AddContactScreen.tsx
│   │   │       └── ProfileScreen.tsx
│   │   └── package.json
│   ├── desktop/                    # Electron桌面端
│   │   ├── src/
│   │   │   ├── main.js             # 主进程
│   │   │   └── preload.js          # 预加载脚本
│   │   └── electron-builder.json   # 打包配置
│   └── shared/                     # 共享代码
│       ├── api.js                  # API端点常量
│       ├── events.js               # Socket事件名
│       └── constants.js            # 消息类型常量
├── e2e/                            # Playwright E2E测试
│   ├── api.spec.ts                 # API集成测试
│   ├── auth.spec.ts                # 认证测试
│   ├── contacts.spec.ts            # 联系人测试
│   ├── chat.spec.ts                # 聊天测试
│   └── fixtures.ts                 # 测试工具
└── docs/                           # 技术文档
```

## API 文档

### 认证

| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|--------|
| POST | `/api/auth/register` | 注册 | `{ phone, email, password, nickname }` |
| POST | `/api/auth/login` | 登录 | `{ phone, email, password }` |

### 用户

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/users/search?q=xxx` | 搜索用户 |
| GET | `/api/users/:id` | 获取用户信息 |
| GET | `/api/users/:id/online` | 检查在线状态 |

### 好友

| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|--------|
| GET | `/api/contacts` | 获取好友列表 | - |
| POST | `/api/contacts` | 添加好友 | `{ friendId }` |
| DELETE | `/api/contacts/:friendId` | 删除好友 | - |

### 消息

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/messages/:contactId` | 获取聊天记录 |

查询参数: `limit` (默认50), `before` (时间戳)

### 个人资料

| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|--------|
| GET | `/api/profile` | 获取当前用户资料 | - |
| PUT | `/api/profile` | 更新个人资料 | `{ nickname, signature }` |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 服务健康检查 |

## Socket.IO 事件

### 客户端 → 服务端

| 事件 | 载荷 | 描述 |
|------|------|------|
| `online` | `userId` | 用户上线 |
| `join_chat` | `{ contactId, userId }` | 加入聊天房间 |
| `leave_chat` | `{ contactId, userId }` | 离开聊天房间 |
| `send_message` | `{ contactId, userId, content, type }` | 发送消息 |
| `typing` | `{ contactId, userId }` | 正在输入 |
| `stop_typing` | `{ contactId, userId }` | 停止输入 |

### 服务端 → 客户端

| 事件 | 载荷 | 描述 |
|------|------|------|
| `new_message` | `{ id, senderId, receiverId, content, type, createdAt }` | 新消息 |
| `typing` | `{ senderId }` | 对方正在输入 |
| `stop_typing` | `{ senderId }` | 对方停止输入 |

## 数据库 Schema

```sql
users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  signature TEXT DEFAULT '',
  wechat_id TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id),
  friend_id TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id)
)

messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id TEXT REFERENCES users(id),
  receiver_id TEXT REFERENCES users(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 测试

### 运行所有测试

```bash
npm run test:e2e
```

### 运行单个测试文件

```bash
npx playwright test e2e/auth.spec.ts
```

### 以UI模式运行

```bash
npx playwright test --ui
```

### 生成测试报告

```bash
npx playwright show-report
```

### 测试覆盖

- `e2e/api.spec.ts` - API集成测试 (健康检查、注册、登录验证)
- `e2e/auth.spec.ts` - 认证流程 (注册、登录、会话持久化、错误处理)
- `e2e/contacts.spec.ts` - 好友管理 (搜索、列表、资料编辑)
- `e2e/chat.spec.ts` - 聊天功能 (多用户实时消息)

## 部署

### Docker (可选)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
RUN npm install
COPY packages/server ./packages/server
EXPOSE 3001
CMD ["npm", "run", "dev:server"]
```

### Nginx

参考 `packages/config/nginx.conf` (如需配置)。

## 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `PORT` | `3001` | 后端服务端口 |
| `HOST` | `0.0.0.0` | 后端服务地址 |
| `JWT_SECRET` | `an-wechat-secret-key-2026` | JWT签名密钥 |
