import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set auth token for admin user
    await page.goto('/auth');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    
    // Navigate to employees page
    await page.goto('/dashboard/employees');
  });

  test('should display employee table', async ({ page }) => {
    await expect(page.locator('h1, h2').filter({ hasText: /employees/i })).toBeVisible();
    
    // Check for table headers
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
  });

  test('should open add employee dialog', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*employee/i });
    await addButton.click();
    
    // Check if dialog is visible
    await expect(page.locator('text=Add New Employee')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should add new employee', async ({ page }) => {
    // Click add employee button
    await page.locator('button').filter({ hasText: /add.*employee/i }).click();
    
    // Fill in the form
    await page.fill('input[name="name"]', 'Test Employee');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'password123');
    
    // Select role
    await page.locator('select[name="role"]').selectOption('USER');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message or table update
    await expect(page.locator('text=Test Employee')).toBeVisible({ timeout: 5000 });
  });

  test('should filter employees by role', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Find and click role filter
    const roleFilter = page.locator('select, button').filter({ hasText: /all.*roles|filter/i }).first();
    if (await roleFilter.count() > 0) {
      await roleFilter.click();
      
      // Select USER role
      await page.locator('text=USER').click();
      
      // Verify filtered results
      await expect(page.locator('td:has-text("ADMIN")')).not.toBeVisible();
    }
  });

  test('should change employee role', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Find first employee role select
    const roleSelects = page.locator('select').filter({ has: page.locator('option:has-text("USER"), option:has-text("ADMIN")') });
    
    if (await roleSelects.count() > 0) {
      const firstSelect = roleSelects.first();
      await firstSelect.selectOption('ADMIN');
      
      // Wait for update confirmation
      await page.waitForTimeout(1000);
      
      // Verify role was changed
      expect(await firstSelect.inputValue()).toBe('ADMIN');
    }
  });

  test('should change employee status', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Find status toggle buttons
    const statusButtons = page.locator('button').filter({ hasText: /active|inactive/i });
    
    if (await statusButtons.count() > 0) {
      const firstButton = statusButtons.first();
      const initialStatus = await firstButton.textContent();
      
      await firstButton.click();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Verify status changed
      const newStatus = await firstButton.textContent();
      expect(newStatus).not.toBe(initialStatus);
    }
  });

  test('should search employees by name', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');
      
      // Wait for filtered results
      await page.waitForTimeout(500);
      
      // All visible names should contain "Test"
      const visibleRows = page.locator('tbody tr:visible');
      const count = await visibleRows.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const rowText = await visibleRows.nth(i).textContent();
          expect(rowText?.toLowerCase()).toContain('test');
        }
      }
    }
  });
});
