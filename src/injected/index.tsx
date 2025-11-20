import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { injectBrand } from "./utils/brand";
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
import { Feature, useStore } from "../utils/store";
import { injectUser } from "./user";
import { injectIgnited } from "./ignited";
import { parsePostsInPage } from "../domains/post";
import { useCustomTheme } from "../utils/custom-theme";
import { injectConfiguration } from "./configuration";

// Fills the store before the rendering pipe
useStore.getState();
useCustomTheme.getState();

window.ignited = {
  isFirstRender: true,
  render: async () => {
    const state = useStore.getState();

    if (isIgnitedPage()) {
      injectIgnited();
    }

    if (window.ignited.isFirstRender) {
      if (!isIgnitedPage()) {
        injectTheme();
      }
      injectBrand();
      trackForumVisits();
    }

    if (document.getElementById("usermenu")) {
      injectConfiguration();
    }

    if (state.features.includes(Feature.NewHomepage) && isHomepage()) {
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
      parsePostsInPage();
    }

    if (window.ignited.isFirstRender) {
      // After the first run, they are triggered on state change
      parseThreadsInPage();
      parseUsersInPage();

      // To prevent blink's the default CSS loads with opacity: 0, we restore the opacity here.
      showBody();
    }
  },
};

window.ignited
  .render()
  .then(() => {
    window.ignited.isFirstRender = false;
    console.log("MV-Ignited🔥 successfully rendered ✅");
  })
  .catch((error) => {
    showContent();
    console.log("MV-Ignited🔥 errored 🔴");
    console.error(error);
    console.info(
      "⬆️ Por favor, comparte el mensaje anterior para facilitar su correción. 🙏🏼",
    );
  });
