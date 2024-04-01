import { mvIgniteStore } from "../utils/store";
import { createRoot } from "react-dom/client";
import { UserIgnoredInThread, UserActionsInThread } from "../react/site/thread";
import React from "react";

const oldPostsHtml: string[] = [];
const oldPostsClass: string[] = [];

export const injectThread = () => {
  const posts = document.querySelectorAll(".cf.post");

  Array.from(posts).forEach((post, index) => {
    const username = post.getAttribute("data-autor");
    const postNum = post.getAttribute("data-num");

    if (window.ignite.isFirstRender) {
      oldPostsHtml.push(post.innerHTML);
      oldPostsClass.push(post.getAttribute("class")!);
    }

    // Restore previously muted posts
    post.innerHTML = oldPostsHtml[index];
    post.setAttribute("class", oldPostsClass[index]!);

    // Render options under user
    Array.from(post.querySelectorAll(".post-avatar")).forEach((element) => {
      const actionsContainerId = `mv-ignite--actions-container-${postNum}`;
      let actionsContainerElement = document.getElementById(actionsContainerId);
      if (!actionsContainerElement) {
        actionsContainerElement = document.createElement("div");
        actionsContainerElement.id = actionsContainerId;
        element.appendChild(actionsContainerElement);
      }

      const root = createRoot(actionsContainerElement);
      root.render(<UserActionsInThread username={username!} />);
    });

    Array.from(posts).forEach((post, index) => {
      const username = post.getAttribute("data-autor");
      const postNum = post.getAttribute("data-num");

      const ignoredUsers = mvIgniteStore.get().ignoredUsers;
      if (!ignoredUsers) {
        return;
      }

      ignoredUsers.forEach((ignoredUsername) => {
        const oldHtml = oldPostsHtml[index];
        const oldClass = oldPostsClass[index];
        // We do not want to ignore OP
        if (username && postNum !== "1" && ignoredUsername === username) {
          const root = createRoot(post);
          root.render(
            <UserIgnoredInThread
              username={username}
              onView={() => {
                root.unmount();
                post.innerHTML = oldHtml;
                post.setAttribute("class", oldClass!);
              }}
            />,
          );
        }
      });
    });
  });
};
