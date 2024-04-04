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
    }
  },
  { url: [{ urlMatches: "https://www.mediavida.com/*" }] },
);
