import { awaitUntil } from "./utils/promises";
import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { injectBrand, injectFont } from "./utils/brand";
import { injectConfiguration } from "./configuration";
import { injectThread } from "./thread";
import { injectHomepage } from "./homepage";

window.ignite = {
  isFirstRender: true,
  render: async () => {
    injectFont().then((customFont) => {
      if (customFont) {
        console.log(`MV-Ignited loaded font: ${customFont}`);
      }
    });
    // Await for page mounted before trying to modify anything
    await awaitUntil(() => !!document.getElementById("content"));

    // To prevent blink's the default CSS loads with opacity:0, we restore the opacity here.
    const body = document.getElementsByTagName("body").item(0);
    body?.setAttribute("style", "opacity: 1 !important;");

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
