# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MV-Ignited is a Chrome/Firefox browser extension (Manifest v3) that enhances the mediavida.com forum experience. Built with React 18, TypeScript, Zustand for state management, TanStack Query for data fetching, and Tailwind CSS for styling.

## Development Commands

```bash
pnpm install           # Install dependencies
pnpm watch            # Development build with watch mode (use this while developing)
pnpm build            # Production build for Chrome
pnpm build:firefox    # Production build for Firefox (includes manifest transformation)
pnpm style            # Format code with Prettier
pnpm test             # Run E2E tests with Playwright
pnpm test:ui          # Run E2E tests with Playwright UI
pnpm test:snapshots   # Fetch mediavida.com HTML for selector development
pnpm clean            # Remove dist/ directory
```

**Testing the extension:**
1. Run `pnpm watch` to build in development mode
2. Load the `dist/` folder as an unpacked extension in Chrome/Firefox
3. Changes will rebuild automatically; reload the extension to see updates

## Architecture

### Three Entry Points (Webpack)

1. **`src/background.ts`** - Service worker that handles:
   - Extension icon updates based on current tab
   - CSS/JS injection into forum pages via `chrome.scripting`
   - Theme updates via Chrome messaging API

2. **`src/popup.tsx`** - Extension popup UI for quick settings access

3. **`src/injected/index.tsx`** - Main content script that:
   - Detects page type (thread list, single thread, user profile, etc.)
   - Orchestrates injection of React components into forum pages
   - Initializes `window.ignited` global for lifecycle management

### Code Organization

```
src/
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

**Injection Flow:**
1. Background service worker detects navigation to mediavida.com
2. Injects CSS first (with `opacity: 0` to prevent flash)
3. Injects `mediavida-extension.js` content script
4. Content script detects page type via URL patterns
5. Renders appropriate React components into DOM

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
- Dynamic CSS injection from background worker for user themes

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
- `webpack.common.js` - Shared config with 3 entry points
- `webpack.dev.js` - Development mode with source maps
- `webpack.prod.js` - Production optimizations

**Output:** `dist/` contains bundled extension files:
- `popup.js`, `background.js`, `mediavida-extension.js`
- `vendor.js` - Shared dependencies (React, Zustand, etc.)
- Manifest and assets copied from `public/`

**Code Splitting:**
- Background worker isolated (no vendor chunk sharing)
- Popup and injected scripts share vendor chunk for size optimization

## Testing

### E2E Testing with Playwright

The project uses Playwright for end-to-end testing. Tests run with the extension loaded in a real Chromium browser on the actual mediavida.com website.

**Test Commands:**
```bash
pnpm test              # Run all E2E tests
pnpm test:ui           # Run tests with Playwright UI
pnpm test:headed       # Run tests in headed mode (see browser)
pnpm test:debug        # Debug tests step-by-step
pnpm test:snapshots    # Fetch fresh HTML from mediavida.com for development
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

The `pnpm test:snapshots` command fetches and saves HTML from different mediavida.com pages for offline selector development:

```bash
pnpm test:snapshots  # Fetches homepage, forums, threads, profiles, etc.
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
1. Build the extension: `pnpm build`
2. Tests will automatically build if needed (configured in playwright.config.ts)
3. Extension loads from `dist/` directory
