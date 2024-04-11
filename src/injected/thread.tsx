import { createRoot, Root } from "react-dom/client";
import { UserActionsInThread } from "../react/site/thread";
import React from "react";
import { ignoreThread } from "../domains/thread";
import { UpvotesInPost, UpvotesLoadingInPost } from "../react/site/thread/post";

export const injectThread = () => {
  const posts = document.querySelectorAll(".cf.post");

  // Thread ignore
  const buttonsContainer = document.querySelector("#more-actions");
  if (buttonsContainer) {
    const ignoreButton = document.createElement("button");
    ignoreButton.setAttribute("class", "btn ignore-topic");
    ignoreButton.innerHTML =
      '<i class="fa fa-eye-slash"></i> Ignore global del hilo';
    ignoreButton.id = "mv-ignited--thread--ignore-button";
    ignoreButton.addEventListener("click", () => {
      const splitHref = window.location.href.split("/");
      ignoreThread(`/${splitHref[3]}/${splitHref[4]}/${splitHref[5]}`);
      ignoreButton.remove();
    });
    buttonsContainer.append(ignoreButton);
  }

  Array.from(posts).forEach((post, index) => {
    const username = post.getAttribute("data-autor");
    const postNum = post.getAttribute("data-num");
    const roots: Root[] = [];

    // Up-vote counter
    const upvoteElement = post.querySelector(".btnmola.post-n");
    if (upvoteElement && upvoteElement.textContent) {
      const numberOfUpvotes = parseInt(upvoteElement.textContent);
      let root = roots[index];
      if (!root) {
        root = createRoot(upvoteElement);
        roots[index] = root;
      }

      // Skeleton
      root.render(<UpvotesLoadingInPost numberOfUpvotes={numberOfUpvotes} />);

      setTimeout(() => {
        upvoteElement.setAttribute("style", "opacity: 1 !important;");
      }, 50);

      const renderUpvotes = async () => {
        const response = await fetch(
          `https://www.mediavida.com${upvoteElement.getAttribute("href")}`,
          {
            headers: {
              accept: "*/*",
              "x-requested-with": "XMLHttpRequest",
            },
            method: "GET",
            mode: "cors",

            credentials: "include",
          },
        );
        const data = await response.text();
        const parser = new DOMParser();
        const fetchedDocument = parser.parseFromString(data, "text/html");

        const upvotesAsArray = Array.from(
          fetchedDocument.querySelectorAll("li"),
        );
        const numberOfUpvotes = upvotesAsArray.length;

        const upvotes: {
          username: string;
          avatar: string;
          url: string;
        }[] = [];

        upvotesAsArray.forEach((upvote) => {
          const anchorElement = upvote.getElementsByTagName("a")?.item(0);
          const username = anchorElement?.getAttribute("title");
          const url = `https://www.mediavida.com/${anchorElement?.getAttribute("href")}`;
          const avatar = upvote
            .getElementsByTagName("img")
            ?.item(0)
            ?.getAttribute("src");

          if (username && avatar && url) {
            upvotes.push({
              username,
              avatar,
              url,
            });
          }
        });

        let root = roots[index];
        if (!root) {
          root = createRoot(upvoteElement);
          roots[index] = root;
        }
        root.render(
          <UpvotesInPost upvotes={upvotes} numberOfUpvotes={numberOfUpvotes} />,
        );
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
          // Check if the button is intersecting with the viewport
          if (entry.isIntersecting) {
            try {
              await renderUpvotes();
            } catch (e) {
              console.error(e);
            }
          }
        });
      });

      observer.observe(post);

      // hijack button upvote
      const upvoteButtonElement = post
        .getElementsByClassName("masmola")
        .item(0);
      upvoteButtonElement?.addEventListener("click", () => {
        setTimeout(renderUpvotes, 300);
      });
    }

    // Render options under user
    Array.from(post.querySelectorAll(".post-avatar")).forEach((element) => {
      const actionsContainerId = `mv-ignited--actions-container-${postNum}`;
      let actionsContainerElement = document.getElementById(actionsContainerId);
      if (!actionsContainerElement) {
        actionsContainerElement = document.createElement("div");
        actionsContainerElement.id = actionsContainerId;
        actionsContainerElement.className = "mv-ignited--actions-container";
        element.appendChild(actionsContainerElement);
      }

      const root = createRoot(actionsContainerElement);
      root.render(<UserActionsInThread username={username!} />);
    });
  });
};
