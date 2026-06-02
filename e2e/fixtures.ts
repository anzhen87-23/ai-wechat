import { test as base } from '@playwright/test';

export interface TestFixtures {
  testUser: { phone: string; nickname: string; password: string };
}

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await use({
      phone: `138${id.padStart(8, '0')}`,
      nickname: `TestUser_${id}`,
      password: 'Test123456',
    });
  },
});

export { expect } from '@playwright/test';
