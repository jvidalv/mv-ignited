import { createRoot } from "react-dom/client";
import React from "react";
import {
  getFavorites,
  getForumLastPosts,
  getForums,
  getLastNews,
  getUserLastPosts,
  getUsername,
} from "./utils/data";
import Home from "../react/site/home";
import { hideContent, showContent } from "./utils/loader";

export const injectHomepage = async () => {
  hideContent();
  const [forums, favorites, lastPosts, lastNews, userLastsPosts] =
    await Promise.all([
      getForums(),
      getFavorites(),
      getForumLastPosts(),
      getLastNews(),
      getUserLastPosts(getUsername()),
    ]);
  showContent();

  const main = document.getElementById("main");
  if (main) {
    const container = document.getElementById("main");
    const root = createRoot(container!);
    root.render(
      <Home
        favorites={favorites}
        forums={forums}
        lastThreads={lastPosts}
        lastNews={lastNews}
        userLastPosts={userLastsPosts}
      />,
    );
  }
};
