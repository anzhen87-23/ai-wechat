import { test, expect } from '@playwright/test';

function createUserData() {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    phone: `138${id.padStart(8, '0')}`,
    nickname: `TestUser_${id}`,
    password: 'Test123456',
  };
}

async function registerUser(page: import('@playwright/test').Page, user: any) {
  await page.goto('/');
  await page.getByText('注册').click();
  await page.getByPlaceholder('手机号').fill(user.phone);
  await page.getByPlaceholder('昵称').fill(user.nickname);
  await page.getByPlaceholder('密码').fill(user.password);
  await page.getByPlaceholder('确认密码').fill(user.password);
  await page.getByRole('button', { name: '注册' }).click();
  await expect(page.getByText('消息')).toBeVisible({ timeout: 10000 });
}

async function addFriend(page: import('@playwright/test').Page, targetNickname: string) {
  // Switch to contacts tab
  await page.getByRole('button', { name: '通讯录' }).click();

  // Search for the user
  const searchInput = page.locator('.search-input');
  await searchInput.fill(targetNickname);

  // Wait for search results and click add
  await page.waitForTimeout(500);
  const addBtn = page.getByRole('button', { name: '添加' }).first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
  }
}

test.describe('Contacts', () => {
  test('should search for users by nickname', async ({ page }) => {
    // Register user A
    const userA = createUserData();
    await registerUser(page, userA);

    // Search for user A from another context (we'll search our own name)
    await page.getByRole('button', { name: '通讯录' }).click();
    const searchInput = page.locator('.search-input');
    await searchInput.fill(userA.nickname);

    await page.waitForTimeout(500);
    // Should show "未找到用户" since we can't add ourselves
    await expect(page.getByText('未找到用户')).toBeVisible();
  });

  test('should display empty contacts list for new user', async ({ page }) => {
    const user = createUserData();
    await registerUser(page, user);

    await page.getByRole('button', { name: '通讯录' }).click();
    await expect(page.getByText('暂无好友')).toBeVisible();
  });

  test('should view profile page', async ({ page }) => {
    const user = createUserData();
    await registerUser(page, user);

    // Go to profile
    await page.getByRole('button', { name: '我' }).click();

    await expect(page.getByText(user.nickname)).toBeVisible();
    await expect(page.getByText('微信号:')).toBeVisible();
    await expect(page.getByText('暂无个性签名')).toBeVisible();
  });

  test('should edit profile nickname and signature', async ({ page }) => {
    const user = createUserData();
    await registerUser(page, user);

    await page.getByRole('button', { name: '我' }).click();
    await page.getByRole('button', { name: '编辑资料' }).click();

    // Edit nickname
    await page.locator('.profile-input').first().fill('NewNickname');
    await page.locator('.profile-input').last().fill('Hello World');

    await page.getByRole('button', { name: '保存' }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText('NewNickname')).toBeVisible();
    await expect(page.getByText('Hello World')).toBeVisible();
  });
});
