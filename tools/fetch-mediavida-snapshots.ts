/**
 * HTML Snapshot Fetcher for mediavida.com
 *
 * This tool fetches and saves HTML from different mediavida.com pages
 * to help with offline selector development and testing.
 *
 * Usage: pnpm test:snapshots
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface PageSnapshot {
  name: string;
  url: string;
  filename: string;
  waitFor?: string; // Optional selector to wait for before capturing
}

const pages: PageSnapshot[] = [
  {
    name: 'Homepage',
    url: '/',
    filename: 'homepage.html',
    waitFor: '#index',
  },
  {
    name: 'Forum Listing',
    url: '/foro',
    filename: 'forum-listing.html',
    waitFor: 'tr[id^="topic_"]',
  },
  {
    name: 'Featured Threads (Spy)',
    url: '/foro/spy',
    filename: 'featured-threads.html',
    waitFor: 'tr[id^="topic_"]',
  },
  {
    name: 'Messages',
    url: '/mensajes',
    filename: 'messages.html',
  },
  {
    name: 'News Forum',
    url: '/foro/noticias',
    filename: 'news-forum.html',
  },
];

async function fetchSnapshots() {
  const snapshotDir = path.join(__dirname, '../tests/fixtures/dom-snapshots');

  // Create directory if it doesn't exist
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }

  console.log('🚀 Fetching HTML snapshots from mediavida.com...\n');

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const pageConfig of pages) {
    try {
      console.log(`📄 Fetching: ${pageConfig.name}`);
      console.log(`   URL: https://www.mediavida.com${pageConfig.url}`);

      // Navigate to page
      await page.goto(`https://www.mediavida.com${pageConfig.url}`, {
        waitUntil: 'networkidle',
      });

      // Wait for specific selector if specified
      if (pageConfig.waitFor) {
        await page.waitForSelector(pageConfig.waitFor, { timeout: 10000 });
      }

      // Get HTML content
      const html = await page.content();

      // Save to file
      const filePath = path.join(snapshotDir, pageConfig.filename);
      fs.writeFileSync(filePath, html, 'utf-8');

      console.log(`   ✅ Saved: ${pageConfig.filename} (${(html.length / 1024).toFixed(1)} KB)\n`);
    } catch (error) {
      console.error(`   ❌ Failed to fetch ${pageConfig.name}:`);
      console.error(`   ${error}\n`);
    }
  }

  // Fetch one thread dynamically
  try {
    console.log('📄 Fetching: Sample Thread');
    await page.goto('https://www.mediavida.com/', { waitUntil: 'networkidle' });

    const firstThreadLink = await page.locator('a[href*="/tema/"]').first();
    const threadUrl = await firstThreadLink.getAttribute('href');

    if (threadUrl) {
      await page.goto(`https://www.mediavida.com${threadUrl}`, {
        waitUntil: 'networkidle',
      });

      await page.waitForSelector('#posts-wrap', { timeout: 10000 });

      const html = await page.content();
      const filePath = path.join(snapshotDir, 'single-thread.html');
      fs.writeFileSync(filePath, html, 'utf-8');

      console.log(`   ✅ Saved: single-thread.html (${(html.length / 1024).toFixed(1)} KB)`);
      console.log(`   Thread: ${threadUrl}\n`);
    }
  } catch (error) {
    console.error('   ❌ Failed to fetch sample thread:');
    console.error(`   ${error}\n`);
  }

  // Fetch one user profile dynamically
  try {
    console.log('📄 Fetching: Sample User Profile');
    await page.goto('https://www.mediavida.com/', { waitUntil: 'networkidle' });

    const firstUserLink = await page.locator('a[href*="/id/"]').first();
    const userUrl = await firstUserLink.getAttribute('href');

    if (userUrl) {
      await page.goto(`https://www.mediavida.com${userUrl}`, {
        waitUntil: 'networkidle',
      });

      const html = await page.content();
      const filePath = path.join(snapshotDir, 'user-profile.html');
      fs.writeFileSync(filePath, html, 'utf-8');

      console.log(`   ✅ Saved: user-profile.html (${(html.length / 1024).toFixed(1)} KB)`);
      console.log(`   Profile: ${userUrl}\n`);
    }
  } catch (error) {
    console.error('   ❌ Failed to fetch sample user profile:');
    console.error(`   ${error}\n`);
  }

  await browser.close();

  console.log('✨ Done! HTML snapshots saved to:', snapshotDir);
  console.log('\nYou can now use these files for offline selector development.');
  console.log('Files are saved in: tests/fixtures/dom-snapshots/\n');
}

// Run the script
fetchSnapshots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
