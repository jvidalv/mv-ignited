import { awaitUntil } from "./utils/promises";
import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { injectBrand, injectFont } from "./utils/brand";
import { injectConfiguration } from "./configuration";
import { injectThread } from "./thread";
import { injectHomepage } from "./homepage";
import {
  isFeaturedThreads,
  isHomepage,
  isIgnitedPage,
  isSubForumThreads,
  isThread,
  isUserProfile,
  showBody,
  showContent,
} from "./utils/loader";
import { injectThreads } from "./threads";
import { parseThreadsInPage } from "../domains/thread";
import { parseUsersInPage } from "../domains/user";
import { useStore } from "../utils/store";
import { injectUser } from "./user";
import { injectIgnited } from "./ingited";
import { getUsers } from "./utils/data";

// Fills it before rendering pipe
useStore.getState();

getUsers("asd");

window.ignite = {
  isFirstRender: true,
  render: async () => {
    injectFont().then((customFont) => {
      if (customFont) {
        console.log(`MV-Ignited loaded font: ${customFont}`);
      }
    });

    if (isIgnitedPage()) {
      injectIgnited();
    }

    // Await for page mounted before trying to modify anything
    await awaitUntil(() => !!document.getElementById("content"));

    if (window.ignite.isFirstRender) {
      injectTheme();
      injectBrand();
      trackForumVisits();
    }

    if (document.getElementById("usermenu")) {
      injectConfiguration();
    }

    if (isHomepage()) {
      injectHomepage();
    }

    if (isUserProfile()) {
      injectUser();
    }

    // Threads
    if (isSubForumThreads() || isFeaturedThreads()) {
      injectThreads();
    }

    if (isThread()) {
      injectThread();
    }

    if (window.ignite.isFirstRender) {
      // After the first run they are triggered on state change
      parseThreadsInPage();
      parseUsersInPage();

      // To prevent blink's the default CSS loads with opacity:0, we restore the opacity here.
      showBody();
    }
  },
};

window.ignite
  .render()
  .then(() => {
    window.ignite.isFirstRender = false;
    console.log("MV-Ignited🔥 successfully rendered ✅");
  })
  .catch((error) => {
    showContent();
    console.log("MV-Ignited🔥 errored 🔴");
    console.error(error);
    console.info(
      "⬆️ Por favor, comparte el mensaje anterior para que pueda solucionarlo. 🙏🏼",
    );
  });
