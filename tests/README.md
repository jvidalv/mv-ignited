# E2E Testing for MV-Ignited

This directory contains end-to-end tests for the MV-Ignited browser extension using Playwright.

## Quick Start

```bash
# Build the extension first
pnpm build

# Run tests
pnpm test              # Run all tests headless
pnpm test:ui           # Run with Playwright UI (recommended)
pnpm test:headed       # See browser while tests run
pnpm test:debug        # Debug tests step-by-step
```

## What Gets Tested

Tests run with the extension loaded in a real Chromium browser on the actual mediavida.com website. This validates:

- ✅ Extension loads and initializes correctly
- ✅ CSS selectors work on live mediavida.com pages
- ✅ Thread features (ignoring, customization, navigation)
- ✅ User features (custom avatars, usernames, colors)
- ✅ Theme features (dark mode, custom themes, fonts)
- ✅ State persistence across page reloads

## Test Files

- `e2e/extension-load.spec.ts` - Verifies extension loads and `window.ignited` is set
- `e2e/selectors.spec.ts` - Validates all CSS selectors work on real pages
- `e2e/thread-features.spec.ts` - Tests thread-related functionality
- `e2e/user-features.spec.ts` - Tests user customization features
- `e2e/theme-features.spec.ts` - Tests theming and styling features

## HTML Snapshot Tool

Fetch and save HTML from mediavida.com for offline selector development:

```bash
pnpm test:snapshots
```

This saves HTML to `tests/fixtures/dom-snapshots/` from:
- Homepage
- Forum listing
- Featured threads
- Single thread (dynamically selected)
- User profile (dynamically selected)
- Messages page

**When to update snapshots:**
- When mediavida.com changes its HTML structure
- When adding new features that target new page types
- Periodically (monthly) to catch site changes

## Writing Tests

All tests use the custom fixture that automatically loads the extension:

```typescript
import { test, expect } from '../fixtures/extension-context';

test('my feature works', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/foro');
  await page.waitForLoadState('networkidle');

  // Extension is already loaded
  const ignited = await page.evaluate(() => window.ignited);
  expect(ignited).toBeTruthy();

  // Test your feature
  await page.locator('.your-selector').click();
  // ... assertions
});
```

## Debugging Tests

**Playwright UI (Recommended):**
```bash
pnpm test:ui
```
- Time travel through test steps
- See screenshots and traces
- Rerun failed tests
- Pick which tests to run

**Debug Mode:**
```bash
pnpm test:debug
```
- Step through tests with debugger
- Pause execution
- Inspect page state

**Headed Mode:**
```bash
pnpm test:headed
```
- Watch tests run in real browser
- Slower but good for understanding failures

## CI/CD

Tests are configured to:
- Build extension automatically before running (via `webServer` in playwright.config.ts)
- Run headless on CI
- Retry failed tests 2x on CI
- Capture screenshots/videos on failure
- Generate HTML report

## Notes

- Tests require a **real internet connection** (they test against live mediavida.com)
- Extension must be built before running tests
- Tests run in headed mode by default (extensions don't work in headless)
- Some tests may be flaky if mediavida.com is slow or down
- Update snapshots when mediavida.com changes structure
