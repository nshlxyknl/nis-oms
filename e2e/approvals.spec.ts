import { test, expect } from '@playwright/test';

test.describe('Approval Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test.describe('Leave Approvals', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/approvals/leave');
    });

    test('should display leave approval page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /leave.*approval/i })).toBeVisible();
    });

    test('should show pending leave requests', async ({ page }) => {
      // Wait for data to load
      await page.waitForTimeout(2000);
      
      const pendingCount = page.locator('text=/\\d+.*pending/i');
      await expect(pendingCount).toBeVisible();
    });

    test('should approve a leave request', async ({ page }) => {
      // Wait for leave cards to load
      await page.waitForTimeout(2000);
      
      const approveButton = page.locator('button').filter({ hasText: /approve/i }).first();
      
      if (await approveButton.count() > 0) {
        await approveButton.click();
        
        // Wait for success message
        await expect(page.locator('text=/approved/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should reject a leave request', async ({ page }) => {
      // Wait for leave cards to load
      await page.waitForTimeout(2000);
      
      const rejectButton = page.locator('button').filter({ hasText: /reject/i }).first();
      
      if (await rejectButton.count() > 0) {
        await rejectButton.click();
        
        // Wait for success message
        await expect(page.locator('text=/rejected/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should display leave details', async ({ page }) => {
      // Wait for leave cards to load
      await page.waitForTimeout(2000);
      
      // Check if leave cards are displayed
      const leaveCards = page.locator('[class*="card"]').filter({ hasText: /day/i });
      
      if (await leaveCards.count() > 0) {
        await expect(leaveCards.first()).toBeVisible();
      }
    });
  });

  test.describe('Room Approvals', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/approvals/rooms');
    });

    test('should display room approval page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /room.*approval/i })).toBeVisible();
    });

    test('should show pending room bookings', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const pendingCount = page.locator('text=/\\d+.*pending/i');
      await expect(pendingCount).toBeVisible();
    });

    test('should approve a room booking', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const approveButton = page.locator('button').filter({ hasText: /approve/i }).first();
      
      if (await approveButton.count() > 0) {
        await approveButton.click();
        await expect(page.locator('text=/approved/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Asset Approvals', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/approvals/assets');
    });

    test('should display asset approval page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /asset.*approval/i })).toBeVisible();
    });

    test('should show pending asset requests', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const pendingCount = page.locator('text=/\\d+.*pending/i');
      await expect(pendingCount).toBeVisible();
    });

    test('should approve an asset request', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const approveButton = page.locator('button').filter({ hasText: /approve/i }).first();
      
      if (await approveButton.count() > 0) {
        await approveButton.click();
        await expect(page.locator('text=/approved/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Approval Navigation', () => {
    test('should navigate between approval pages', async ({ page }) => {
      await page.goto('/dashboard/approvals');
      
      // Navigate to leave approvals
      const leaveLink = page.locator('a[href*="leave"]');
      if (await leaveLink.count() > 0) {
        await leaveLink.click();
        await expect(page).toHaveURL(/\/approvals\/leave/);
      }
      
      // Navigate to room approvals
      const roomLink = page.locator('a[href*="room"]');
      if (await roomLink.count() > 0) {
        await roomLink.click();
        await expect(page).toHaveURL(/\/approvals\/room/);
      }
      
      // Navigate to asset approvals
      const assetLink = page.locator('a[href*="asset"]');
      if (await assetLink.count() > 0) {
        await assetLink.click();
        await expect(page).toHaveURL(/\/approvals\/asset/);
      }
    });
  });
});
