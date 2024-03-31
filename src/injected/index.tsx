import { createRoot } from "react-dom/client";
import Home from "../react/site/home";
import React from "react";
import { awaitUntil } from "./utils/promises";
import {
  getFavorites,
  getForums,
  getForumLastPosts,
  getLastNews,
  getUserLastPosts,
  getUsername,
} from "./utils/data";
import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { UserIgnoredInThread, UserOptionsInThread } from "../react/site/thread";
import { mvstore } from "../utils/json";
import { Configuration } from "../react/site/configuration";
import { injectBrand } from "./utils/brand";

const render = async () => {
  // Await for page mounted before trying to modify anything
  await awaitUntil(() => !!document.getElementById("content"));
  injectTheme();
  trackForumVisits();
  injectBrand();

  // Homepage
  if (document.getElementById("index")) {
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
  }

  // Thread
  if (document.getElementById("post-container")) {
    const posts = document.querySelectorAll(".cf.post");
    const oldPostsHtml: string[] = [];
    const oldPostsClass: string[] = [];

    const ignoreUsers = () => {
      Array.from(posts).forEach((post, index) => {
        const username = post.getAttribute("data-autor");
        const postNum = post.getAttribute("data-num");

        const ignoredUsers = mvstore.get().ignoredUsers;
        if (!ignoredUsers) {
          return;
        }

        ignoredUsers.forEach((ignoredUsername) => {
          // We do not want to ignore OP
          if (username && postNum !== "1" && ignoredUsername === username) {
            const oldHtml = oldPostsHtml[index];
            const oldClass = oldPostsClass[index];
            const root = createRoot(post);
            // post.setAttribute("class", "");
            root.render(
              <UserIgnoredInThread
                username={username}
                onView={() => {
                  post.innerHTML = oldHtml;
                  post.setAttribute("class", oldClass!);
                }}
              />,
            );
          }
        });
      });
    };

    Array.from(posts).forEach((post) => {
      const username = post.getAttribute("data-autor");

      // Render options under user
      Array.from(post.querySelectorAll(".post-avatar")).forEach((element) => {
        const container = document.createElement("div");
        element.appendChild(container);
        const root = createRoot(container);
        root.render(
          <UserOptionsInThread
            username={username!}
            ignoreUsers={ignoreUsers}
          />,
        );
      });

      oldPostsHtml.push(post.innerHTML);
      oldPostsClass.push(post.getAttribute("class")!);

      ignoreUsers();
    });
  }

  // User config
  if (document.getElementById("settings")) {
    let container = document.getElementById("mv-ignited");

    if (!container) {
      const wrapper = document.getElementsByClassName("c-main-l-alt").item(0)!;
      container = document.createElement("div");
      container.id = "mv-ignited";
      wrapper.appendChild(container);
    }

    const root = createRoot(container);
    root.render(<Configuration rerender={render} />);
  }
};

render().then(() => console.log("mv-ignited rendered"));
