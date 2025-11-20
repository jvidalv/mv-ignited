# BUGBOT.md

This file provides guidance for debugging and troubleshooting MV-Ignited browser extension.

## Quick Diagnostics

**Extension not loading:**
1. Check Chrome Extensions page (`chrome://extensions`)
2. Ensure "Developer mode" is enabled
3. Check for errors in extension details
4. Verify `dist/manifest.json` exists after build

**Features not working on forum:**
1. Open browser DevTools on mediavida.com
2. Check Console for errors
3. Verify extension icon shows active state
4. Check if `window.ignited` exists in console
5. Verify feature is enabled in extension popup

**Build errors:**
```bash
pnpm clean    # Clear old build
pnpm install  # Reinstall dependencies
pnpm build    # Rebuild
```

## Common Issues

### Content Script Not Injecting

**Symptoms:** No extension functionality on mediavida.com pages

**Check:**
- Background service worker errors: `chrome://extensions` → Inspect service worker
- Host permissions: Manifest should have `https://www.mediavida.com/*`
- Injection timing in `src/background.ts`

**Debug:**
```javascript
// In DevTools Console on mediavida.com
console.log(window.ignited); // Should be truthy if script loaded
```

### State Not Persisting

**Symptoms:** Settings reset after page reload

**Check:**
- localStorage: DevTools → Application → Local Storage
- Look for keys with extension data
- Verify Zustand store subscription in `src/utils/store.ts`

**Debug:**
```javascript
// In DevTools Console
localStorage.getItem('mv-ignited-store'); // Check stored state
```

### Styles Not Applied

**Symptoms:** Extension UI looks broken or unstyled

**Check:**
- CSS injection in `src/background.ts`
- Verify `dist/styles/mediavida.css` exists
- Check for CSS conflicts with forum styles

**Debug:**
- DevTools → Elements → Check for injected stylesheets
- Look for `mediavida.css` in document `<head>`

### Dark Mode Issues

**Symptoms:** Dark mode not working or partially broken

**Check:**
- Tailwind config uses `selector` strategy (not `media`)
- Theme applied to correct root element
- Custom theme colors in `useCustomTheme` store

**Fix:**
- Verify `dark` class on target element
- Check CSS variable definitions
- Review `src/injected/utils/theme.ts`

### Performance Issues

**Symptoms:** Slow page loads or laggy interactions

**Check:**
- Large data sets in localStorage
- Excessive re-renders in React components
- Heavy DOM queries in `src/domains/` parsers

**Optimize:**
- Use React.memo for expensive components
- Debounce state updates
- Cache parsed DOM data

### Extension Icon Not Updating

**Symptoms:** Icon doesn't change based on active tab

**Check:**
- `src/background.ts` event listeners for `webNavigation`
- Icon files exist in `dist/icons/`
- `chrome.action.setIcon` calls

**Debug:**
```javascript
// In service worker console
chrome.tabs.query({active: true}, tabs => console.log(tabs[0].url));
```

## Debugging Tools

**Chrome DevTools:**
- **Extension pages:** Right-click popup → Inspect
- **Background worker:** `chrome://extensions` → Service worker → Inspect
- **Content scripts:** Regular DevTools on mediavida.com page

**Useful Console Commands:**
```javascript
// Check extension state
window.ignited

// Get current store state
// (if accessing from content script context)
JSON.parse(localStorage.getItem('mv-ignited-store'))

// Check loaded features
// Access via React DevTools or add debug logging
```

**React DevTools:**
Install React DevTools extension to inspect component tree and state.

## Testing Checklist

Before releasing changes:

- [ ] Extension loads without errors
- [ ] All features work on thread listing page
- [ ] All features work on single thread page
- [ ] Settings persist after reload
- [ ] Dark mode works correctly
- [ ] Custom themes apply properly
- [ ] Ignored threads/users actually get ignored
- [ ] Popup UI works and reflects current state
- [ ] Chrome and Firefox builds both work

## Log Debugging

Add debug logs strategically:

```typescript
// In injection logic
console.log('[MV-Ignited] Injecting into page type:', pageType);

// In state updates
console.log('[MV-Ignited] Feature toggled:', feature, enabled);

// In parsers
console.log('[MV-Ignited] Parsed data:', data);
```

Filter console by `[MV-Ignited]` prefix.

## Source Maps

Development builds include source maps:
- DevTools shows original TypeScript files
- Set breakpoints in source files
- Step through code execution

Production builds have source maps disabled for size.

## Known Gotchas

1. **Service worker restarts:** Background worker can restart anytime; don't rely on in-memory state
2. **Page reloads on feature toggle:** Expected behavior; features need full page context
3. **localStorage limits:** Keep stored data reasonable (~5MB limit)
4. **Manifest v3 restrictions:** No `eval()`, no remote code, CSP restrictions
5. **Double injection:** `window.ignited` flag prevents this; check if conditional logic works

## Getting Help

Check these files for context:
- `CLAUDE.md` - Full architecture documentation
- `AGENTS.md` - Development workflow guide
- `README.md` - Basic setup instructions
- Webpack configs in `webpack/` - Build configuration
