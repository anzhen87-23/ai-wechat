# AnWeChat - Test Documentation

## Overview

AnWeChat uses Playwright for end-to-end (E2E) testing. Tests cover all major features across multiple browsers.

## Test Structure

```
e2e/
├── fixtures.ts        # Shared test fixtures (test user factory)
├── api.spec.ts        # API integration tests
├── auth.spec.ts       # Authentication flow tests
├── contacts.spec.ts   # Contact management tests
└── chat.spec.ts       # Chat feature tests
```

## Test Categories

### 1. API Tests (`api.spec.ts`)

Tests the REST API directly using Playwright's `request` fixture.

| Test | Description |
|------|-------------|
| Health endpoint | Verifies `/health` returns `{"status": "ok"}` |
| Register validation | Verifies `400` when no fields provided |
| Register success | Verifies token + user returned on valid registration |
| Login failure | Verifies `401` for invalid credentials |

### 2. Auth Tests (`auth.spec.ts`)

Tests the full authentication flow through the web UI.

| Test | Description |
|------|-------------|
| Login page display | Verifies login page renders correctly |
| User registration | End-to-end registration flow |
| Password mismatch | Error handling when passwords don't match |
| User login | Login with existing credentials |
| Invalid credentials | Error handling for wrong password/user |
| Session persistence | Token persists across page reloads |

### 3. Contacts Tests (`contacts.spec.ts`)

Tests friend management and profile features.

| Test | Description |
|------|-------------|
| User search | Search by nickname |
| Empty contact list | New user has no contacts |
| Profile display | Profile page shows user info |
| Edit profile | Update nickname and signature |

### 4. Chat Tests (`chat.spec.ts`)

Tests real-time messaging features.

| Test | Description |
|------|-------------|
| Empty chat list | New user has no conversations |
| Placeholder state | No chat selected shows placeholder |
| Message input UI | Input area renders correctly |
| Multi-user chat | Two browser contexts exchange messages |

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

This starts the backend and web servers automatically (via `webServer` config in `playwright.config.ts`), then runs all tests.

### Run a single test file

```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run tests in UI mode (debugger)

```bash
npx playwright test --ui
```

### Run on specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
```

### Generate test report

```bash
npx playwright test
npx playwright show-report
```

## Test Fixtures

### `testUser` fixture

Creates a unique user for each test run to avoid conflicts:

```typescript
const testUser = {
  phone: `138${randomId}`,
  nickname: `TestUser_${randomId}`,
  password: 'Test123456',
};
```

### Multi-context testing

For real-time chat tests, two separate browser contexts are created to simulate two different users:

```typescript
const contextA = await browser.newContext();
const contextB = await browser.newContext();
```

Each context has its own localStorage, cookies, and Socket.IO connection.

## Test Configuration

### Playwright Config (`playwright.config.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| `testDir` | `./e2e` | Test directory |
| `fullyParallel` | `false` | Tests run sequentially to avoid DB conflicts |
| `workers` | `1` | Single worker for SQLite compatibility |
| `timeout` | `30000` | 30s per test |
| `retries` | `0` (dev) / `2` (CI) | Retry flaky tests in CI |
| `baseURL` | `http://localhost:5173` | Web frontend URL |
| `trace` | `on-first-retry` | Record trace for debugging |
| `screenshot` | `only-on-failure` | Auto-screenshot on failure |

### Browser Projects

| Project | Device | Use Case |
|---------|--------|----------|
| `chromium` | Desktop Chrome | Primary testing |
| `firefox` | Desktop Firefox | Cross-browser compatibility |
| `webkit` | Desktop Safari | Cross-browser compatibility |
| `Mobile Chrome` | Pixel 5 | Mobile viewport testing |

### Web Servers

Two servers are auto-started:
1. **Backend** (`packages/server`) on port 3001, health checked at `/health`
2. **Web frontend** (`packages/web`) on port 5173

Both use `reuseExistingServer: true` in dev mode to avoid restart delays.

## Adding New Tests

1. Create a new `.spec.ts` file in `e2e/`
2. Import from `@playwright/test`
3. Use `test.describe()` for grouping and `test()` for individual tests
4. Use shared fixtures from `fixtures.ts` for consistent test data
5. Add the file to the test suite (no registration needed, Playwright auto-discovers)

### Example test

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('AnWeChat')).toBeVisible();
});
```
