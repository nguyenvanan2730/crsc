const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('CRSC Homepage Tests', () => {
  test('should load homepage and check layout', async ({ page }) => {
    // Navigate to the local HTML file
    const filePath = 'file://' + path.join(__dirname, 'index.html');
    await page.goto(filePath);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot for desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'screenshots/desktop-full.png', fullPage: true });

    // Check if all main sections are visible
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.services')).toBeVisible();
    await expect(page.locator('.about')).toBeVisible();
    await expect(page.locator('.contact')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();

    // Check service cards
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(4);

    // Take tablet screenshot
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshots/tablet-full.png', fullPage: true });

    // Take mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });

    // Test mobile menu
    await page.locator('.menu-toggle').click();
    await expect(page.locator('.nav-list')).toHaveClass(/active/);
    await page.screenshot({ path: 'screenshots/mobile-menu-open.png' });

    // Test language toggle
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('#langToggle').click();
    await page.screenshot({ path: 'screenshots/english-version.png', fullPage: true });

    // Test form
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('This is a test message');
    await page.screenshot({ path: 'screenshots/form-filled.png' });

    // Test form submission
    await page.locator('.submit-btn').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/form-submitted.png' });
  });

  test('should test responsive breakpoints', async ({ page }) => {
    const filePath = 'file://' + path.join(__dirname, 'index.html');
    await page.goto(filePath);

    const viewports = [
      { name: 'mobile-small', width: 375, height: 667 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'desktop-large', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.screenshot({
        path: `screenshots/viewport-${viewport.name}.png`,
        fullPage: false
      });
    }
  });
});
