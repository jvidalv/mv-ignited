# AGENTS.md

This file provides guidance to AI agents working with code in this repository.

## Project Context

MV-Ignited is a browser extension that enhances the mediavida.com forum. It injects React components into the forum's existing DOM to add new features and improve the user experience.

## Quick Start

```bash
yarn install             # Install dependencies
yarn watch              # Start development mode (outputs to dist/)
yarn build:chrome       # Production build for Chrome → dist-chrome/
yarn build:chrome:zip   # Build Chrome + create store-ready zip
yarn build:firefox      # Production build for Firefox → dist-firefox/
yarn build:firefox:zip  # Build Firefox + create store-ready zip
# Load dist/ (dev) or dist-chrome/ (prod) as unpacked extension in Chrome
```

## Code Quality Validation

**CRITICAL: After completing EVERY task, you MUST run these three commands:**

```bash
yarn tsc --noEmit                  # Type checking
yarn eslint src --ext .ts,.tsx     # Linting
yarn style                         # Formatting
```

Never skip this validation step. All three commands must pass before committing any changes.

## Architecture Overview

**Four Entry Points:**
1. **Theme Loader** (`src/theme-loader.ts`) - Runs at `document_start` to inject custom theme CSS before any rendering
2. **Background Service Worker** (`src/background.ts`) - Handles extension lifecycle, icon updates, and script injection
3. **Popup UI** (`src/popup.tsx`) - Quick access settings interface
4. **Content Scripts** (`src/injected/`) - Main functionality injected into forum pages

**Key Directories:**
- `src/domains/` - Data parsing from forum DOM (pure functions)
- `src/injected/` - Injection orchestration and page detection
- `src/react/` - React components for UI enhancements
- `src/utils/` - Zustand stores with localStorage persistence

## State Management

Uses Zustand with `subscribeWithSelector` middleware and localStorage persistence:

```typescript
// Main store: useStore
- threadsIgnored: string[]
- features: Feature[]
- users: MVUser[]
- customFont?: string

// Theme store: useCustomTheme
- customWidth, headerColour, pageBackground, primaryColour
```

Changes to feature toggles trigger `window.location.reload()`.

## Development Workflow

1. **Adding a new feature:**
   - Add feature to `Feature` enum
   - Implement component in `src/react/site/`
   - Add injection logic in `src/injected/`
   - Update store if state is needed

2. **Modifying existing features:**
   - Components are in `src/react/site/{feature}/`
   - Injection logic in corresponding `src/injected/{feature}.tsx`
   - Data parsing in `src/domains/{entity}.ts`

3. **Styling:**
   - Use Tailwind CSS classes
   - Dark mode: `dark:` prefix (selector strategy)
   - Custom colors: `bg-surface`, `text-primary`, etc.

## Important Patterns

**Zero-FOUC Content Injection (Dual-Layer Approach):**
1. **`document_start` timing** (via manifest content_scripts):
   - Static CSS injected (`mediavida.css` with `body { opacity: 0 }`)
   - `theme-loader.js` reads localStorage and injects custom theme CSS
   - Page is hidden until all processing completes
2. **Content processing** (while page hidden):
   - Background worker injects `mediavida-extension.js`
   - Script detects page type, parses content, applies filters
   - React components rendered
3. **Page reveal**:
   - `showBody()` sets `opacity: 1` after processing
   - User sees fully processed page with zero flash
   - `window.ignited` flag prevents double-injection

**Why this approach?** Theme-loader alone only prevents theme flash. The opacity shield prevents flash of ALL unprocessed content (ignored threads, user customizations, etc.).

**Data Flow:**
- DOM parsing → `src/domains/` functions
- API calls → `src/injected/utils/data.ts` with TanStack Query
- State → Zustand stores with auto-localStorage sync
- UI updates → React components re-render

**Chrome Extension APIs:**
- `chrome.scripting.executeScript` - Inject JavaScript
- `chrome.scripting.insertCSS` - Inject styles
- `chrome.runtime.onMessage` - Service worker ↔ content script messaging
- `chrome.webNavigation` - Page navigation detection

## Testing

Load the extension:
1. Build with `yarn watch` or `yarn build`
2. Chrome → Extensions → Load unpacked → Select `dist/`
3. Navigate to mediavida.com to see changes

For Firefox: Use `yarn build:firefox` which transforms the manifest.

## Common Tasks

**Add a toggleable feature:**
1. Add to `Feature` enum
2. Check feature in store: `useStore(state => state.features.includes(Feature.YourFeature))`
3. Conditionally render/inject based on feature flag

**Parse new data from forum:**
1. Create parsing function in appropriate `src/domains/*.ts` file
2. Add TypeScript types for the data structure
3. Use in injection logic or components

**Add user customization:**
1. Add field to `useStore` or `useCustomTheme`
2. Update UI in settings page (`src/react/site/configuration/`)
3. Apply customization in injection logic

## Git Workflow

**Commit Conventions:**
- Commit after completing each individual piece of work (feature, bug fix, refactor)
- Write detailed, user-focused commit messages suitable for release notes
- **NEVER include Claude as co-author** in commits
- Example: "Add support for custom user avatars" or "Fix dark mode contrast in settings panel"

## Build Output

**Development:** Webpack bundles into `dist/`
**Production Chrome:** Webpack bundles into `dist-chrome/`
**Production Firefox:** Webpack bundles into `dist-firefox/` (with manifest transformation)

All builds contain:
- `theme-loader.js` - Zero-flash theme CSS injector (~2.5KB, standalone)
- `popup.js` - Extension popup
- `background.js` - Service worker
- `mediavida-extension.js` - Main content script
- `vendor.js` - Shared dependencies (React, Zustand, etc.)
- `styles/vendor.css`, `styles/mediavida.css` - Extracted CSS
- `manifest.json`, assets from `public/`

**Store deployment:**
- `yarn build:chrome:zip` → `mv-ignited-chrome.zip` (~156KB)
- `yarn build:firefox:zip` → `mv-ignited-firefox.zip` (~156KB)

## E2E Testing

Tests use Playwright to load the extension in a real browser and test against the live mediavida.com site.

**Running Tests:**
```bash
yarn build         # Build extension first
yarn test          # Run all E2E tests
yarn test:ui       # Run with Playwright UI (recommended for development)
yarn test:headed   # See the browser while tests run
yarn test:debug    # Debug step-by-step
```

**HTML Snapshot Tool:**
```bash
yarn test:snapshots  # Fetch fresh HTML from mediavida.com
```

This fetches and saves HTML from different mediavida.com pages to `tests/fixtures/dom-snapshots/`. Use these snapshots to:
- Build CSS selectors offline
- Test selectors against real HTML
- Develop features without constant browser navigation

**Writing Tests:**
```typescript
import { test, expect } from '../fixtures/extension-context';

test('feature works', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/');  // Extension auto-loaded

  // Test your feature
  const element = await page.locator('.your-selector');
  expect(element).toBeVisible();
});
```

**Test Organization:**
- `tests/e2e/extension-load.spec.ts` - Extension initialization
- `tests/e2e/selectors.spec.ts` - Verify selectors work on live site
- `tests/e2e/thread-features.spec.ts` - Thread-related features
- `tests/e2e/user-features.spec.ts` - User customization features
- `tests/e2e/theme-features.spec.ts` - Theme and styling features

**Key Points:**
- Tests run against the **actual mediavida.com website**
- Extension loaded automatically via custom fixture
- No mocking - tests verify real functionality
- Update snapshots periodically as mediavida.com changes
