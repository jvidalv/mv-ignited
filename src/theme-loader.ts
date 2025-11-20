// This script runs at document_start to inject theme CSS before any rendering
// This prevents any flash when the page loads with a custom theme

type MVIgnitedCustomTheme = {
  customWidth?: string;
  headerColour?: string;
  pageBackground?: string;
  primaryColour?: string;
};

const MV_IGNITED_STORE_KEY = "mv-ignited::custom-theme";

// Read theme from localStorage (synchronous - safe at document_start)
const getThemeFromStorage = (): MVIgnitedCustomTheme | null => {
  try {
    const saved = localStorage.getItem(MV_IGNITED_STORE_KEY);
    if (saved) {
      return JSON.parse(saved) as MVIgnitedCustomTheme;
    }
  } catch (error) {
    console.error("MV-Ignited: Failed to read theme from localStorage", error);
  }
  return null;
};

// Generate CSS from theme settings (same logic as background.ts)
const generateThemeCSS = (theme: MVIgnitedCustomTheme): string => {
  return `
    ${
      theme.customWidth
        ? `
      @media only screen and (min-width: 1200px) {
       .fullw, #main, #topbar {
          max-width: ${theme.customWidth} !important;
       }
       #topbar {
          width: ${theme.customWidth} !important;
       }
      }
      `
        : ""
    }
    ${
      theme.headerColour
        ? `
      :root {
        --custom-theme--header: ${theme.headerColour};
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
       theme.pageBackground
         ? `
      :root {
        --custom-theme--background: ${theme.pageBackground};
      }
      #content {
        background-color: var(--custom-theme--background) !important;
      }
      `
         : ""
     }
     ${
       theme.primaryColour
         ? `
      :root {
        --custom-theme--primary-colour: ${theme.primaryColour};
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
};

// Inject theme CSS immediately
const injectThemeCSS = () => {
  const theme = getThemeFromStorage();

  if (theme) {
    const css = generateThemeCSS(theme);

    // Create and inject style tag
    const styleElement = document.createElement("style");
    styleElement.id = "mv-ignited-theme";
    styleElement.textContent = css;

    // Inject into <head> or <html> (whichever is available at document_start)
    const target = document.head || document.documentElement;
    target.appendChild(styleElement);

    console.log("MV-Ignited: Theme CSS injected at document_start");
  }
};

// Run immediately at document_start
injectThemeCSS();
