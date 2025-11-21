# MV-Ignited

![MV-Ignited Banner](https://i.imgur.com/0PxobPt.png)

A browser extension that re-imagines the mediavida.com forum experience with enhanced features, customization options, and quality-of-life improvements.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Install-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/mv-ignited/eajomfdkpghamhpfkoemijokpomnohef)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Install-orange?logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/mv-ignited/versions/)

## 🚀 Installation

### From Official Stores

- **Chrome/Edge/Brave:** [Install from Chrome Web Store](https://chromewebstore.google.com/detail/mv-ignited/eajomfdkpghamhpfkoemijokpomnohef)
- **Firefox:** [Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/mv-ignited/versions/)

### Manual Installation (Development)

1. Clone this repository
2. Install dependencies: `yarn install`
3. Build the extension:
   - For Chrome: `yarn build:chrome` → outputs to `dist-chrome/`
   - For Firefox: `yarn build:firefox` → outputs to `dist-firefox/`
4. Load the extension in your browser:
   - **Chrome:** Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select the `dist-chrome/` folder
   - **Firefox:** Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file in the `dist-firefox/` folder

## ✨ Features

### 🎨 Visual Customization

- **New Homepage** - Custom homepage with quick access to forums, latest news, and featured threads
- **Custom Themes** - Personalize colors, page width, header, and background
- **Dark Mode** - Full dark mode support with customizable colors
- **No Avatars** - Hide all user avatars for a cleaner interface
- **No Logo** - Remove the site logo for more screen space
- **No Side Menu** - Hide the sidebar for a focused reading experience
- **Monospace Font** - Switch to a monospace font for code-like viewing
- **Black & White Mode** - High contrast black and white display

### 🧵 Thread Management

- **Thread Ignoring** - Hide threads you're not interested in
- **Improved Upvotes** - Enhanced upvote display and positioning
- **Thread Filtering** - Easily manage and filter your thread list

### 👤 User Customization

- **Custom Usernames** - Set custom display names for any user
- **Custom Avatars** - Replace user avatars with your own images
- **Username Colors** - Assign custom colors to usernames
- **User Notes** - Add private notes to user profiles
- **Post Border Colors** - Highlight specific users' posts with colored borders
- **Ignore Users** - Hide posts from specific users

### 🖼️ Media Management

- **Images in Spoiler** - Automatically wrap images in spoiler tags
- **YouTube in Spoiler** - Auto-spoiler YouTube embeds
- **Twitter in Spoiler** - Auto-spoiler Twitter/X embeds
- **Random Media in Spoiler** - Auto-spoiler other embedded media

### ⚙️ Other Features

- **Custom Fonts** - Choose your preferred font family
- **Settings Sync** - All settings persist across sessions via localStorage
- **Fast Performance** - Optimized with React 18 and efficient state management

## 🛠️ Development

### Prerequisites

- Node.js 18+ and yarn
- TypeScript 5.3+

### Tech Stack

- **Framework:** React 18 with TypeScript
- **State Management:** Zustand with localStorage persistence
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS with dark mode support
- **Build Tool:** Webpack 5
- **Testing:** Playwright for E2E tests

### Commands

```bash
# Install dependencies
yarn install

# Development build with watch mode (outputs to dist/)
yarn watch

# Production builds
yarn build:chrome           # Build for Chrome → dist-chrome/
yarn build:chrome:zip       # Build Chrome + create store-ready zip
yarn build:firefox          # Build for Firefox → dist-firefox/
yarn build:firefox:zip      # Build Firefox + create store-ready zip

# Clean all build outputs
yarn clean

# Run E2E tests
yarn test

# Run tests with UI
yarn test:ui

# Format code
yarn style

# Fetch HTML snapshots from mediavida.com for development
yarn test:snapshots
```

### Project Structure

```
src/
├── theme-loader.ts        # Zero-flash theme CSS injector (runs at document_start)
├── background.ts          # Service worker (extension lifecycle)
├── popup.tsx             # Extension popup UI
├── injected/             # Content scripts injected into mediavida.com
│   ├── index.tsx         # Main orchestrator
│   ├── threads.tsx       # Thread listing enhancements
│   ├── thread.tsx        # Single thread enhancements
│   ├── user.tsx          # User profile enhancements
│   ├── homepage.tsx      # Custom homepage
│   └── utils/            # Utilities (data fetching, page detection)
├── domains/              # Business logic (DOM parsing)
│   ├── forum.ts
│   ├── thread.ts
│   ├── user.ts
│   └── post.ts
├── react/                # React components
│   ├── popup/            # Popup components
│   └── site/             # Forum enhancement components
└── utils/
    ├── store.ts          # Zustand store with persistence
    └── custom-theme.ts   # Theme management
```

### Testing

The project uses Playwright for E2E testing with the extension loaded in a real browser on mediavida.com.

```bash
# Run all tests
yarn test

# Run with Playwright UI (recommended for development)
yarn test:ui

# Run in headed mode (see browser)
yarn test:headed

# Debug tests
yarn test:debug
```

**Note:** Extension tests require headed mode (extensions don't work in headless browsers).

### HTML Snapshot Tool

Fetch and save HTML from mediavida.com for offline selector development:

```bash
yarn test:snapshots
```

This saves HTML to `tests/fixtures/dom-snapshots/` from various pages (homepage, forums, threads, profiles). Use these snapshots to build and test CSS selectors without constant navigation.

## 🏗️ Architecture

### Extension Entry Points

1. **Theme Loader** (`src/theme-loader.ts`)
   - Runs at `document_start` (earliest possible timing)
   - Reads custom theme from localStorage synchronously
   - Injects theme CSS before any page rendering
   - Prevents flash of default theme (FOUC prevention)

2. **Background Service Worker** (`src/background.ts`)
   - Manages extension lifecycle
   - Injects JavaScript content scripts into forum pages
   - Updates extension icon based on current tab
   - Handles dynamic theme updates

3. **Popup UI** (`src/popup.tsx`)
   - Quick access to settings
   - Toggle features on/off

4. **Content Scripts** (`src/injected/`)
   - Detects page type (homepage, threads, profiles)
   - Injects React components into existing DOM
   - Applies customizations and features
   - Uses `showBody()` to reveal page after processing (FOUC prevention)

### State Management

Uses Zustand with localStorage persistence:

- **Main Store:** Thread ignoring, feature toggles, user customizations
- **Theme Store:** Custom colors, width, fonts
- All state changes sync immediately to localStorage
- Feature toggles trigger page reload to apply changes

### Build Output

Webpack bundles the extension into separate folders for each browser:

**Chrome build** (`dist-chrome/`):
- `theme-loader.js` - Zero-flash theme CSS injector (~2.5KB)
- `popup.js` - Extension popup
- `background.js` - Service worker (Manifest v3 format)
- `mediavida-extension.js` - Main content script
- `vendor.js` - Shared dependencies (React, Zustand, etc.)
- `styles/vendor.css`, `styles/mediavida.css` - Extracted CSS

**Firefox build** (`dist-firefox/`):
- Same as Chrome, but with manifest transformed for Firefox compatibility
- `background.js` uses scripts array instead of service_worker

**Store-ready zips:**
- `yarn build:chrome:zip` → `mv-ignited-chrome.zip` (~156KB)
- `yarn build:firefox:zip` → `mv-ignited-firefox.zip` (~156KB)

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Detailed architecture and development guide for AI assistants
- **[AGENTS.md](./AGENTS.md)** - Quick reference for AI agents
- **[BUGBOT.md](./BUGBOT.md)** - Debugging and troubleshooting guide
- **[tests/README.md](./tests/README.md)** - Testing documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Commit Guidelines

- Commit after every individual piece of work
- Write detailed commit messages suitable for release notes
- Focus on what changed and why it matters to users

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 👤 Author

Josep Vidal

## 🔗 Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/mv-ignited/eajomfdkpghamhpfkoemijokpomnohef)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/mv-ignited/versions/)
- [Report Issues](https://github.com/your-username/mv-ignited/issues) <!-- Update with actual repo URL -->
