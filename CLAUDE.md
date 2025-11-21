# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MV-Ignited is a Chrome/Firefox browser extension (Manifest v3) that enhances the mediavida.com forum experience. Built with React 18, TypeScript, Zustand for state management, TanStack Query for data fetching, and Tailwind CSS for styling.

## Development Commands

```bash
yarn install             # Install dependencies
yarn watch              # Development build with watch mode (use this while developing)
yarn build              # Production build (legacy, outputs to dist/)
yarn build:chrome       # Production build for Chrome → dist-chrome/
yarn build:chrome:zip   # Build Chrome + create zip for store upload
yarn build:firefox      # Production build for Firefox → dist-firefox/
yarn build:firefox:zip  # Build Firefox + create zip for store upload
yarn style              # Format code with Prettier
yarn test               # Run E2E tests with Playwright
yarn test:ui            # Run E2E tests with Playwright UI
yarn test:snapshots     # Fetch mediavida.com HTML for selector development
yarn clean              # Remove all dist folders and zip files
```

**Testing the extension:**
1. Run `yarn watch` to build in development mode
2. Load the `dist/` folder as an unpacked extension in Chrome/Firefox
3. Changes will rebuild automatically; reload the extension to see updates

**Store deployment:**
1. Run `yarn build:chrome:zip` or `yarn build:firefox:zip`
2. Upload the generated `mv-ignited-chrome.zip` or `mv-ignited-firefox.zip` to respective stores

## Code Quality Validation

**CRITICAL: After completing EVERY task, you MUST run these three commands in sequence:**

```bash
yarn tsc --noEmit     # Type checking - must pass with no errors
yarn eslint src --ext .ts,.tsx  # Linting - must pass with no errors
yarn style            # Code formatting with Prettier
```

This ensures:
- Type safety is maintained across the codebase
- Code follows consistent style guidelines
- No lint errors are introduced
- All code is properly formatted

**Never skip this step.** Always run all three commands after making any changes to TypeScript/TSX files, even for minor edits. If any command fails, fix the issues before committing.

## Architecture

### Four Entry Points (Webpack)

1. **`src/theme-loader.ts`** - Zero-flash theme injection (runs at `document_start`):
   - Reads custom theme from localStorage synchronously
   - Generates and injects theme CSS before ANY page rendering
   - Prevents flash of default theme (FOUC prevention)
   - Standalone bundle (no dependencies) for maximum speed

2. **`src/background.ts`** - Service worker that handles:
   - Extension icon updates based on current tab
   - JS injection into forum pages via `chrome.scripting`
   - Dynamic theme updates via Chrome messaging API (when user changes settings)

3. **`src/popup.tsx`** - Extension popup UI for quick settings access

4. **`src/injected/index.tsx`** - Main content script that:
   - Detects page type (thread list, single thread, user profile, etc.)
   - Orchestrates injection of React components into forum pages
   - Initializes `window.ignited` global for lifecycle management

### Code Organization

```
src/
├── theme-loader.ts       # Zero-flash theme CSS injection at document_start
├── background.ts         # Service worker (extension lifecycle)
├── popup.tsx             # Extension popup UI
│
├── domains/              # DOM parsing & data extraction logic
│   ├── forum.ts          # Parse forum-level data
│   ├── thread.ts         # Parse thread listings, filter ignored threads
│   ├── user.ts           # Parse user data
│   └── post.ts           # Parse post data
│
├── injected/             # Content injection orchestration
│   ├── index.tsx         # Main orchestrator (page detection & injection)
│   ├── threads.tsx       # Inject into thread listings
│   ├── thread.tsx        # Inject into single thread view
│   ├── user.tsx          # Inject into user profiles
│   ├── homepage.tsx      # Custom homepage feature
│   ├── configuration.tsx # Settings page injection
│   └── utils/
│       ├── data.ts       # API data fetching functions
│       ├── loader.ts     # Page type detection utilities
│       └── theme.ts      # Dynamic theme injection
│
├── react/                # React components & UI
│   ├── popup/            # Extension popup components
│   ├── site/             # Forum page enhancement components
│   │   ├── home/         # Custom homepage
│   │   ├── thread/       # Thread view enhancements
│   │   ├── configuration/# Settings UI
│   │   └── components/   # Shared UI components
│   └── hooks/            # Shared React hooks
│
└── utils/
    ├── store.ts          # Main Zustand store with localStorage persistence
    ├── custom-theme.ts   # Custom theme store
    └── dom.ts            # DOM manipulation utilities
```

### State Management (Zustand)

Two main stores with localStorage persistence:

**`useStore`** (main app state):
- `threadsIgnored[]` - Array of ignored thread IDs
- `customFont` - Custom font selection
- `features[]` - Enabled features (Feature enum)
- `users[]` - User customizations (ignored status, colors, avatars, notes)
- `latestUpdateViewed` - Version tracking

**`useCustomTheme`**:
- `customWidth`, `headerColour`, `pageBackground`, `primaryColour`

State updates for feature toggles trigger `window.location.reload()` to apply changes.

### Key Patterns

**Zero-Flash Injection Flow (Comprehensive FOUC Prevention):**

This extension uses a **dual-layer approach** to prevent all flash of unstyled content:

1. **Layer 1: `document_start` timing** (earliest possible):
   - Static CSS files (`mediavida.css`, `vendor.css`) injected via manifest
   - **Body opacity shield**: `body { opacity: 0 !important; }` hides entire page immediately
   - `theme-loader.js` reads localStorage and injects custom theme CSS synchronously
   - All CSS applied BEFORE any page rendering

2. **Layer 2: Content processing** (while page is hidden):
   - Background service worker detects navigation to mediavida.com
   - Injects `mediavida-extension.js` and `vendor.js` content scripts
   - Extension processes all features:
     - Parse and hide ignored threads
     - Apply user customizations
     - Filter content based on settings
     - Inject React components

3. **Page reveal**:
   - After all processing completes, `showBody()` sets `opacity: 1`
   - User sees fully processed page instantly
   - **Zero flash** for all extension features (themes, filters, customizations)

**Why this approach?**
- `theme-loader.js` alone only prevents theme flash
- Opacity shield prevents flash of **all** unprocessed content
- Combined approach = comprehensive zero-FOUC experience

**Page Type Detection:**
- Uses URL path matching in `src/injected/utils/loader.ts`
- Different components injected based on forum section
- `window.ignited` flag prevents double-injection

**Data Fetching:**
- TanStack Query for API data (auto-refetch intervals)
- Direct DOM parsing for existing forum content
- Chrome messaging API for service worker ↔ content script communication

**Styling:**
- Tailwind CSS with dark mode (`selector` strategy)
- Custom CSS variables for theming
- Zero-flash architecture:
  - Static CSS injected via manifest at `document_start`
  - Custom theme CSS injected synchronously from localStorage at `document_start`
  - Dynamic theme updates still use background worker for live preview

## Important Conventions

**State Changes:**
- All store mutations auto-sync to localStorage immediately
- Feature toggle changes reload the page
- User/thread changes are debounced with subscriptions

**Component Integration:**
- React components injected into existing forum DOM
- Use `window.ignited` to check extension lifecycle state
- First-render flag prevents double-processing

**Naming:**
- React hooks: `use*` prefix
- Exported types: `MV{Name}` prefix (e.g., `MVUser`, `MVThread`)
- Store files: `*store.ts` or `use*.ts` pattern

**Chrome Extension Specifics:**
- Manifest v3 service worker (not background page)
- Permissions: `webNavigation`, `scripting`, host permission for mediavida.com
- Content scripts injected programmatically via `chrome.scripting` API
- Icon updates based on active tab URL

**Git Commits:**
- Commit after every individual piece of work (feature, fix, refactor)
- Write detailed commit messages that can be used for release notes
- NEVER include Claude as co-author in commits
- Focus commit messages on what changed and why it matters to users

## Build System

Webpack configuration in `webpack/`:
- `webpack.common.js` - Shared config with 4 entry points
- `webpack.dev.js` - Development mode with source maps
- `webpack.prod.js` - Production optimizations

**Output:** `dist/` contains bundled extension files:
- `theme-loader.js` - Standalone theme CSS injector (~2.5KB)
- `popup.js`, `background.js`, `mediavida-extension.js`
- `vendor.js` - Shared dependencies (React, Zustand, etc.)
- `styles/vendor.css`, `styles/mediavida.css` - Extracted CSS
- Manifest and assets copied from `public/`

**Code Splitting:**
- `theme-loader` and `background` isolated (no vendor chunk sharing)
- `popup` and `mediavida-extension` share vendor chunk for size optimization
- CSS extracted to static files via `mini-css-extract-plugin` for zero-flash loading

## Testing

### E2E Testing with Playwright

The project uses Playwright for end-to-end testing. Tests run with the extension loaded in a real Chromium browser on the actual mediavida.com website.

**Test Commands:**
```bash
yarn test              # Run all E2E tests
yarn test:ui           # Run tests with Playwright UI
yarn test:headed       # Run tests in headed mode (see browser)
yarn test:debug        # Debug tests step-by-step
yarn test:snapshots    # Fetch fresh HTML from mediavida.com for development
```

**Test Structure:**
```
tests/
├── e2e/
│   ├── extension-load.spec.ts    # Verify extension loads and initializes
│   ├── selectors.spec.ts         # Validate CSS selectors work on live site
│   ├── thread-features.spec.ts   # Test thread ignoring, customization
│   ├── user-features.spec.ts     # Test user customizations, avatars
│   └── theme-features.spec.ts    # Test dark mode, custom themes
└── fixtures/
    ├── extension-context.ts      # Reusable context with extension loaded
    └── dom-snapshots/            # Cached HTML from mediavida.com
```

**HTML Snapshot Tool:**

The `yarn test:snapshots` command fetches and saves HTML from different mediavida.com pages for offline selector development:

```bash
yarn test:snapshots  # Fetches homepage, forums, threads, profiles, etc.
```

This allows you to:
- Build and test CSS selectors without constantly navigating the live site
- Work offline with real HTML structures
- Verify selectors against actual mediavida.com markup

Snapshots are saved to `tests/fixtures/dom-snapshots/` and should be updated periodically.

**Writing Tests:**

All tests use the custom `test` fixture from `tests/fixtures/extension-context.ts` which automatically loads the extension:

```typescript
import { test, expect } from '../fixtures/extension-context';

test('my test', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/');
  // Extension is already loaded
  const ignited = await page.evaluate(() => window.ignited);
  expect(ignited).toBeTruthy();
});
```

**Before Running Tests:**
1. Build the extension: `yarn build`
2. Tests will automatically build if needed (configured in playwright.config.ts)
3. Extension loads from `dist/` directory
