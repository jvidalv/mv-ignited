import { createRoot } from "react-dom/client";
import { UserActionsInThread } from "../react/site/thread";
import React from "react";
import { ignoreThread } from "../domains/thread";

export const injectThread = () => {
  const posts = document.querySelectorAll(".cf.post");

  // Thread ignore
  const ignoreButton = document.querySelector('a[title="Ignorar el tema"]');
  ignoreButton?.addEventListener("click", () =>
    ignoreThread(window.location.href.replace("https://www.mediavida.com", "")),
  );

  Array.from(posts).forEach((post) => {
    const username = post.getAttribute("data-autor");
    const postNum = post.getAttribute("data-num");

    // Render options under user
    Array.from(post.querySelectorAll(".post-avatar")).forEach((element) => {
      const actionsContainerId = `mv-ignited--actions-container-${postNum}`;
      let actionsContainerElement = document.getElementById(actionsContainerId);
      if (!actionsContainerElement) {
        actionsContainerElement = document.createElement("div");
        actionsContainerElement.id = actionsContainerId;
        element.appendChild(actionsContainerElement);
      }

      const root = createRoot(actionsContainerElement);
      root.render(<UserActionsInThread username={username!} />);
    });
  });
};
