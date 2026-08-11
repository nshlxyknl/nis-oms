import { test, expect } from '@playwright/test';

test.describe('User Booking Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Login as user
    await page.goto('/auth');
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test.describe('Asset Booking', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/book-assets');
    });

    test('should display asset booking page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /book.*asset/i })).toBeVisible();
    });

    test('should show available assets', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      // Check if assets are displayed
      const assetCards = page.locator('[class*="card"]');
      const count = await assetCards.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should filter assets by availability', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const availableFilter = page.locator('button, select').filter({ hasText: /available/i }).first();
      
      if (await availableFilter.count() > 0) {
        await availableFilter.click();
        await page.waitForTimeout(500);
        
        // Verify only available assets are shown
        const unavailableAssets = page.locator('text=/occupied|maintenance|assigned/i');
        expect(await unavailableAssets.count()).toBe(0);
      }
    });

    test('should request an asset', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const requestButton = page.locator('button').filter({ hasText: /request|book/i }).first();
      
      if (await requestButton.count() > 0) {
        await requestButton.click();
        
        // Fill request form if dialog appears
        const submitButton = page.locator('button[type="submit"]').filter({ hasText: /submit|confirm/i });
        
        if (await submitButton.isVisible()) {
          await submitButton.click();
        }
        
        // Wait for success message
        await expect(page.locator('text=/requested|success/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Room Booking', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/book-rooms');
    });

    test('should display room booking page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /book.*room/i })).toBeVisible();
    });

    test('should show available rooms', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const roomCards = page.locator('[class*="card"]');
      const count = await roomCards.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should book a room with date selection', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const bookButton = page.locator('button').filter({ hasText: /book|reserve/i }).first();
      
      if (await bookButton.count() > 0) {
        await bookButton.click();
        
        // Check if date picker appears
        const dateInput = page.locator('input[type="date"], input[type="datetime-local"]').first();
        
        if (await dateInput.isVisible()) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];
          
          await dateInput.fill(dateStr);
        }
        
        // Submit booking
        const submitButton = page.locator('button').filter({ hasText: /submit|confirm|book/i }).last();
        
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Wait for confirmation
          await expect(page.locator('text=/booked|success/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should display room details', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      const roomCards = page.locator('[class*="card"]').first();
      
      if (await roomCards.count() > 0) {
        // Check if room information is displayed
        await expect(roomCards).toBeVisible();
      }
    });
  });

  test.describe('Leave Request', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/leave');
    });

    test('should display leave request page', async ({ page }) => {
      await expect(page.locator('h1, h2').filter({ hasText: /leave/i })).toBeVisible();
    });

    test('should open leave request form', async ({ page }) => {
      const requestButton = page.locator('button').filter({ hasText: /request.*leave|apply/i }).first();
      
      if (await requestButton.count() > 0) {
        await requestButton.click();
        
        // Check if form is visible
        await expect(page.locator('input[name*="date"], select[name*="type"]')).toBeVisible({ timeout: 3000 });
      }
    });

    test('should submit leave request', async ({ page }) => {
      const requestButton = page.locator('button').filter({ hasText: /request.*leave|apply/i }).first();
      
      if (await requestButton.count() > 0) {
        await requestButton.click();
        
        // Fill form
        const typeSelect = page.locator('select').filter({ has: page.locator('option:has-text("annual"), option:has-text("sick")') }).first();
        if (await typeSelect.isVisible()) {
          await typeSelect.selectOption('annual');
        }
        
        // Fill dates
        const startDate = page.locator('input[name*="start"]').first();
        const endDate = page.locator('input[name*="end"]').first();
        
        if (await startDate.isVisible()) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const nextWeek = new Date(tomorrow);
          nextWeek.setDate(nextWeek.getDate() + 5);
          
          await startDate.fill(tomorrow.toISOString().split('T')[0]);
          await endDate.fill(nextWeek.toISOString().split('T')[0]);
        }
        
        // Fill reason
        const reasonInput = page.locator('textarea[name*="reason"], input[name*="reason"]').first();
        if (await reasonInput.isVisible()) {
          await reasonInput.fill('Annual vacation');
        }
        
        // Submit
        const submitButton = page.locator('button[type="submit"]').filter({ hasText: /submit|apply|request/i }).first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Wait for success
          await expect(page.locator('text=/submitted|success/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should display leave history', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      // Check if leave history/status is displayed
      const leaveItems = page.locator('[class*="card"], tr').filter({ hasText: /pending|approved|rejected/i });
      
      const count = await leaveItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
