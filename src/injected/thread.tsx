import { createRoot, Root } from "react-dom/client";
import React from "react";
import { ignoreThread } from "../domains/thread";
import { UpvotesInPost, UpvotesLoadingInPost } from "../react/site/thread";
import { updateUserInStore, useStore } from "../utils/store";

export const injectThread = () => {
  // Tooltips on user click
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const users = useStore.getState().users;
      // Tooltip on username click
      const divElement = mutation.addedNodes.item(0) as HTMLDivElement;
      if (divElement?.getAttribute("class") === "f-card show") {
        const muteButton = divElement.querySelector("#mute-user");
        const username = divElement.querySelector(".user-info h4")?.textContent;
        const user = users.find((u) => u.username === username);
        const uid = muteButton?.getAttribute("data-uid");
        const avatar =
          divElement.querySelector(".user-avatar img")?.getAttribute("src") ??
          "https://mediavida.b-cdn.net/img/users/avatar/default_big.png";

        // Ignore button
        if (username && uid && avatar) {
          const mvIgnitedMuteButton = document.createElement("a");
          mvIgnitedMuteButton.setAttribute(
            "style",
            "border-top: 1px solid grey; padding-top: 4px;",
          );
          mvIgnitedMuteButton.innerHTML = `<button class="btn" style="width: 100%"><i class="fa fa-microphone${user?.isIgnored ? "" : "-slash"}"></i><span class="ddi"> ${user?.isIgnored ? "Des-ignorar" : "Ignorar"} globalmente</span></button>`;
          mvIgnitedMuteButton.onclick = () => {
            updateUserInStore(
              {
                username,
                uid,
                avatar,
              },
              "isIgnored",
              !user?.isIgnored,
            );

            document.body.click();
          };
          document.querySelector(".user-controls")?.append(mvIgnitedMuteButton);
        }

        // Customization button
        const mvIgnitedButton = document.createElement("a");
        mvIgnitedButton.innerHTML = `<a class="btn" style="border-color: orange" href="https://www.mediavida.com/ignited?q=${username}"><i class="fa fa-edit"></i><span class="ddi"> Customizar🔥</span></a>`;
        document.querySelector(".user-controls")?.append(mvIgnitedButton);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
  });

  // Ignore thread
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

  const users = useStore.getState().users;

  document.querySelectorAll(".cf.post").forEach((post, index) => {
    const username = post.getAttribute("data-autor");
    const roots: Root[] = [];

    // Notes
    const user = users.find((u) => u.username === username);
    const container = post.querySelector(".post-meta");
    if (container && user?.note) {
      const note = document.createElement("span");
      note.setAttribute(
        "class",
        "ct ml-1 transition opacity-80 hover:opacity-100",
      );
      note.innerHTML = user.note;
      container.append(note);
    }

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

    // Render tags under user @todo
    post.querySelectorAll(".post-avatar").forEach(() => {
      // const actionsContainerId = `mv-ignited--actions-container-${postNum}`;
      // let actionsContainerElement = document.getElementById(actionsContainerId);
      // if (!actionsContainerElement) {
      //   actionsContainerElement = document.createElement("div");
      //   actionsContainerElement.id = actionsContainerId;
      //   actionsContainerElement.className = "mv-ignited--actions-container";
      //   element.appendChild(actionsContainerElement);
      // }
      //
      // const root = createRoot(actionsContainerElement);
      // root.render(<UserActionsInThread username={username!} />);
    });
  });
};
