import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';

/**
 * Helper to handle cookie consent banner
 */
async function handleCookieConsent(page: Page) {
  try {
    // Wait for and click the cookie consent button if it appears
    // Adjust selector based on actual mediavida.com cookie banner
    const cookieButton = page.locator('button:has-text("Aceptar"), button:has-text("Accept"), #didomi-notice-agree-button, .didomi-button-agree');

    if (await cookieButton.isVisible({ timeout: 5000 })) {
      await cookieButton.click();
      await page.waitForTimeout(1000); // Wait for banner to disappear
    }
  } catch (error) {
    // Cookie banner might not appear or already accepted
    console.log('No cookie banner or already accepted');
  }
}

/**
 * Extended test fixture that provides a browser context with the extension loaded
 */
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false, // Extensions require headed mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    // Create initial page and handle cookies once for the entire context
    const page = await context.newPage();
    await page.goto('https://www.mediavida.com/', { waitUntil: 'domcontentloaded' });
    await handleCookieConsent(page);
    await page.close();

    await use(context);
    await context.close();
  },

  // eslint-disable-next-line no-empty-pattern
  extensionId: async ({ context }, use) => {
    // For now, we don't need the extension ID
    await use('');
  },
});

export const expect = test.expect;
export { handleCookieConsent };
