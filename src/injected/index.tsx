import { awaitUntil } from "./utils/promises";
import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { injectBrand } from "./utils/brand";
import { injectConfiguration } from "./configuration";
import { injectThread } from "./thread";
import { injectHomepage } from "./homepage";

window.ignite = {
  isFirstRender: true,
  render: async () => {
    // Await for page mounted before trying to modify anything
    await awaitUntil(() => !!document.getElementById("content"));

    injectTheme();
    injectBrand();
    trackForumVisits();

    // Settings
    if (document.getElementById("usermenu")) {
      injectConfiguration();
    }

    // Homepage
    if (document.getElementById("index")) {
      injectHomepage();
    }

    // Thread
    if (document.getElementById("post-container")) {
      injectThread();
    }
  },
};

window.ignite.render().then(() => {
  window.ignite.isFirstRender = false;
  console.log("MV-ignite: Successfully rendered");
});
