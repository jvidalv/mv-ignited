import { createRoot } from "react-dom/client";
import React from "react";
import {
  getFavorites,
  getForumLastThreads,
  getForums,
  getLastNews,
  getUserLastPosts,
  getUsername,
} from "./utils/data";
import Home from "../react/site/home";
import { hideContent, showContent } from "./utils/loader";

export const injectHomepage = async () => {
  hideContent();
  const [forums, favorites, lastThreads, lastNews, userLastPosts] =
    await Promise.all([
      getForums(),
      getFavorites(),
      getForumLastThreads(),
      getLastNews(),
      getUserLastPosts(getUsername()),
    ]);
  showContent();

  const main = document.getElementById("main");
  if (main) {
    const root = createRoot(main);
    root.render(
      <Home
        favorites={favorites}
        forums={forums}
        lastThreads={lastThreads}
        lastNews={lastNews}
        userLastPosts={userLastPosts}
      />
    );

    // Small delay fix issue with mounted dom elements not being available immediately after
    return new Promise((resolve) => setTimeout(resolve, 1));
  }
};
