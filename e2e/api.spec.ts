import { test, expect } from '@playwright/test';

test.describe('API Health', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('http://localhost:3001/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('register endpoint validates required fields', async ({ request }) => {
    const response = await request.post('http://localhost:3001/api/auth/register', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

  test('register with valid data returns token and user', async ({ request }) => {
    const id = Date.now().toString(36);
    const response = await request.post('http://localhost:3001/api/auth/register', {
      data: {
        phone: `138${id.padStart(8, '0')}`,
        nickname: `APIUser_${id}`,
        password: 'Test123456',
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.nickname).toBeTruthy();
    expect(body.user.wechatId).toBeTruthy();
  });

  test('login with invalid credentials returns error', async ({ request }) => {
    const response = await request.post('http://localhost:3001/api/auth/login', {
      data: {
        phone: 'nonexistent',
        password: 'wrong',
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });
});
