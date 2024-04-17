import { MVIgnitedCustomTheme } from "./utils/custom-theme";

chrome.tabs.onUpdated.addListener((tabId) => {
  // Check if the tab's URL is updated
  if (tabId) {
    updateIcon(tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.id) {
      updateIcon(tab.id);
    }
  });
});

async function updateIcon(tabId: number) {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return chrome.action.setIcon({
    path: tab?.url ? "icons/logo-128.png" : "icons/logo-128-disabled.png",
    tabId: tabId,
  });
}

chrome.webNavigation.onCommitted.addListener(
  (details) => {
    // Check if it's the main frame, not an iframe
    if (details.frameId === 0) {
      chrome.scripting.insertCSS({
        target: { tabId: details.tabId },
        files: ["/styles/mediavida.css"],
      });
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["/vendor.js", "/mediavida-extension.js"],
      });
    }
  },
  { url: [{ urlMatches: "https://www.mediavida.com/*" }] },
);

let previousCSS: string;

chrome.runtime.onMessage.addListener(function (
  message: MVIgnitedCustomTheme,
  sender,
  sendResponse,
) {
  if (sender?.tab?.id) {
    if (previousCSS) {
      chrome.scripting.removeCSS({
        target: { tabId: sender.tab.id },
        css: previousCSS,
      });
    }

    previousCSS = `
    ${
      message.headerColour &&
      `
      :root {
        --custom-theme--header: ${message.headerColour};
      }
      
      #header {
        background: var(--custom-theme--header) !important;
        border-color: var(--custom-theme--header) !important;
      }
      
      #header #sections>li>a:hover {
        background: var(--custom-theme--header) !important;
      }
      `
    }
     ${
       message.pageBackground &&
       `
      :root {
        --custom-theme--background: ${message.pageBackground};
      }
      
      #content {
        background-color: var(--custom-theme--background) !important;
      }
      `
     }
    `;

    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      css: previousCSS,
    });
  }
  sendResponse({ response: "✅" });
});
