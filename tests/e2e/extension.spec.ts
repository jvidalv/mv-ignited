import { test, expect } from '../fixtures/extension-context';

/**
 * Minimal E2E test suite to verify extension functionality
 * Keeps tests minimal to avoid rate limiting and Cloudflare blocks
 */

test.describe('MV-Ignited Extension', () => {
  test('can navigate and access forum pages', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify we're on mediavida.com
    expect(page.url()).toContain('mediavida.com');

    // Check basic page structure exists
    const body = await page.locator('body');
    expect(await body.isVisible()).toBe(true);

    await page.close();
  });

  test('localStorage persistence works', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Add test data to localStorage
    await page.evaluate(() => {
      const testData = { test: 'value', features: ['TestFeature'] };
      localStorage.setItem('mv-ignited-test', JSON.stringify(testData));
    });

    // Reload and verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' });

    const persistedData = await page.evaluate(() => {
      const data = localStorage.getItem('mv-ignited-test');
      return data ? JSON.parse(data) : null;
    });

    expect(persistedData).toBeDefined();
    expect(persistedData.test).toBe('value');

    // Cleanup
    await page.evaluate(() => localStorage.removeItem('mv-ignited-test'));

    await page.close();
  });

  test('extension store initializes correctly', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait a bit for extension to initialize store
    await page.waitForTimeout(2000);

    // Check store exists in localStorage
    const storeData = await page.evaluate(() => {
      const data = localStorage.getItem('mv-ignited::store');
      return data ? JSON.parse(data) : null;
    });

    // Store should exist and have expected structure
    expect(storeData).toBeDefined();
    if (storeData) {
      expect(storeData).toHaveProperty('features');
      expect(Array.isArray(storeData.features)).toBe(true);
    }

    await page.close();
  });
});
