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

export const injectHomepage = async () => {
  const content = document.getElementById("content");
  content?.setAttribute("style", "opacity: 0 !important");

  const [forums, favorites, lastPosts, lastNews, userLastsPosts] =
    await Promise.all([
      getForums(),
      getFavorites(),
      getForumLastPosts(),
      getLastNews(),
      getUserLastPosts(getUsername()),
    ]);

  content?.setAttribute("style", "opacity: 1 !important");

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
