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
      message.customWidth
        ? `
      @media only screen and (min-width: 1200px) {
       .fullw, #main, #topbar {
          max-width: ${message.customWidth} !important;
       }
       #topbar {
          width: ${message.customWidth} !important;
       }
      }
      `
        : ""
    }
    ${
      message.headerColour
        ? `
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
        : ""
    }
     ${
       message.pageBackground
         ? `
      :root {
        --custom-theme--background: ${message.pageBackground};
      }
      #content {
        background-color: var(--custom-theme--background) !important;
      }
      `
         : ""
     }
     ${
       message.primaryColour
         ? `
      :root {
        --custom-theme--primary-colour: ${message.primaryColour};
      }
      .btn-primary {
        background-color: var(--custom-theme--primary-colour) !important;
        border-color: #bb5b0700 !important;
      }
      .btn-primary:hover {
        background-color: var(--custom-theme--primary-colour) !important;
        border-color: #bb5b0700 !important;
      }
      .btn-primary .badge {
        color: #ec7309;
        background-color: var(--custom-theme--primary-colour) !important;
      }
      .label-primary {
        background-color: var(--custom-theme--primary-colour) !important;
      }
      #perfil #temas .unread .title, .btn-link, a.quote{
        color: var(--custom-theme--primary-colour) !important;
      }
      #foros_spy #tab_spy, #foros_spy #tab_spy:hover, #top #tab_top, #top #tab_top:hover, .actualidad #tab_act, .actualidad #tab_act:hover, .clanes #tab_cln, .clanes #tab_cln:hover, .foros #tab_for, .foros #tab_for:hover, .grupos #tab_grp, .grupos #tab_grp:hover, .psn #tab_psn, .psn #tab_psn:hover, .streams #tab_str, .streams #tab_str:hover, .usuarios #tab_usr, .usuarios #tab_usr:hover {
        color: var(--custom-theme--primary-colour) !important;
      }
      `
         : ""
     }
    `;

    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      css: previousCSS,
    });
  }
  sendResponse({ response: "✅" });
});
