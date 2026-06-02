import { test, expect } from '@playwright/test';

// Helper: generate unique user data
function createUserData() {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    phone: `138${id.padStart(8, '0')}`,
    nickname: `TestUser_${id}`,
    password: 'Test123456',
  };
}

test.describe('Authentication', () => {
  test('should display login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AnWeChat/);
    await expect(page.getByText('登录')).toBeVisible();
    await expect(page.getByPlaceholder('手机号 / 邮箱')).toBeVisible();
    await expect(page.getByPlaceholder('密码')).toBeVisible();
  });

  test('should register a new user', async ({ page }) => {
    const user = createUserData();

    await page.goto('/');
    await page.getByText('注册').click();

    await expect(page.getByText('注册')).toBeVisible();
    await page.getByPlaceholder('手机号').fill(user.phone);
    await page.getByPlaceholder('昵称').fill(user.nickname);
    await page.getByPlaceholder('密码').fill(user.password);
    await page.getByPlaceholder('确认密码').fill(user.password);

    await page.getByRole('button', { name: '注册' }).click();

    // After successful registration, should show chat page
    await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(user.nickname)).toBeVisible();
  });

  test('should show error when passwords do not match during registration', async ({ page }) => {
    await page.goto('/');
    await page.getByText('注册').click();

    await page.getByPlaceholder('手机号').fill('13800138000');
    await page.getByPlaceholder('昵称').fill('TestUser');
    await page.getByPlaceholder('密码').fill('Test123456');
    await page.getByPlaceholder('确认密码').fill('Different123');

    await page.getByRole('button', { name: '注册' }).click();

    await expect(page.getByText('两次密码输入不一致')).toBeVisible();
  });

  test('should login with existing user', async ({ page }) => {
    const user = createUserData();

    // First register
    await page.goto('/');
    await page.getByText('注册').click();
    await page.getByPlaceholder('手机号').fill(user.phone);
    await page.getByPlaceholder('昵称').fill(user.nickname);
    await page.getByPlaceholder('密码').fill(user.password);
    await page.getByPlaceholder('确认密码').fill(user.password);
    await page.getByRole('button', { name: '注册' }).click();
    await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });

    // Logout
    await page.getByRole('button', { name: '我' }).click();
    await page.getByRole('button', { name: '退出登录' }).click();
    await expect(page.getByText('登录')).toBeVisible();

    // Login again
    await page.getByPlaceholder('手机号 / 邮箱').fill(user.phone);
    await page.getByPlaceholder('密码').fill(user.password);
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(user.nickname)).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('手机号 / 邮箱').fill('nonexistent');
    await page.getByPlaceholder('密码').fill('wrongpassword');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('User not found')).toBeVisible({ timeout: 10000 });
  });

  test('should persist login session (localStorage token)', async ({ page }) => {
    const user = createUserData();

    // Register
    await page.goto('/');
    await page.getByText('注册').click();
    await page.getByPlaceholder('手机号').fill(user.phone);
    await page.getByPlaceholder('昵称').fill(user.nickname);
    await page.getByPlaceholder('密码').fill(user.password);
    await page.getByPlaceholder('确认密码').fill(user.password);
    await page.getByRole('button', { name: '注册' }).click();
    await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });

    // Reload page - should stay logged in
    await page.reload();
    await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });
  });
});
