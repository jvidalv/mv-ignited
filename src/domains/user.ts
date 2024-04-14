import { useStore } from "../utils/store";
import {
  isMessages,
  isThread,
  isThreadLive,
  isUserProfile,
  isUserProfileSignatures,
} from "../injected/utils/loader";
import { awaitUntil } from "../injected/utils/promises";
import { getUsername } from "../injected/utils/data";

export const parseUsersInPage = () => {
  const parseDynamicContent = async () => {
    const { users } = useStore.getState();

    // Tooltips in posts on username click
    const userInfoElement = document.querySelector("#user-card .user-info h4");
    const userAvatarImgElement = document.querySelector(
      "#user-card .user-avatar img",
    );
    const username = userInfoElement?.textContent;
    const userInStore = users.find((u) => u.username === username);

    if (userInfoElement && username && userInStore) {
      if (userInStore.usernameCustom) {
        userInfoElement.textContent = userInStore.usernameCustom;
      }
      if (userInStore.usernameColour) {
        userInfoElement.setAttribute(
          "style",
          `color: ${userInStore.usernameColour}`,
        );
      }
      if (userInStore?.avatarCustom) {
        if (userAvatarImgElement) {
          userAvatarImgElement.setAttribute("src", userInStore.avatarCustom);
          userAvatarImgElement.setAttribute("style", "width:80px;height:80px");
        } else {
          const container = document.querySelector(".user-avatar a");
          const imageElement = document.createElement("img");
          imageElement.setAttribute("class", "avatar");
          imageElement.setAttribute("src", userInStore?.avatarCustom);
          imageElement.setAttribute("style", "width:80px;height:80px");
          if (container) {
            container.innerHTML = "";
            container.append(imageElement);
          }
        }
      }
    }

    // Notifications && Messages top
    await awaitUntil(
      () =>
        !!document.querySelectorAll("#usermenu .active .fly .content li img")
          .length,
    );

    document
      .querySelectorAll("#usermenu .active .fly .content li")
      .forEach((element) => {
        const imageElement = element.querySelector("img");

        const usernameStrongElement = element.querySelector(
          ".stuff blockquote > strong, .stuff > strong",
        );
        const username = imageElement?.getAttribute("alt");
        const userInStore = users.find((u) => u.username === username);

        // Customizations
        if (userInStore && username && usernameStrongElement) {
          if (userInStore.usernameCustom) {
            usernameStrongElement.textContent = userInStore.usernameCustom;
          }
          if (userInStore.usernameColour) {
            usernameStrongElement.setAttribute(
              "style",
              `color: ${userInStore.usernameColour}`,
            );
          }
          if (userInStore?.avatarCustom && imageElement) {
            imageElement.setAttribute("src", userInStore.avatarCustom);
          }
        }
      });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(parseDynamicContent);
  });

  observer.observe(document.body, {
    childList: true,
  });

  setInterval(parseDynamicContent, 500);

  const { users } = useStore.getState();

  // Our own avatar
  const user = users.find((u) => u.username === getUsername());
  if (user?.avatarCustom) {
    document
      .querySelector("#usermenu .av img")
      ?.setAttribute("src", user?.avatarCustom);
  }

  if (isMessages()) {
    document.querySelectorAll(".nano-content li").forEach((liElement) => {
      const username =
        liElement.querySelector("img")?.getAttribute("alt") ||
        liElement.querySelector("a")?.getAttribute("href")?.split("/")[2];

      const userCustom = users.find((u) => u.username === username);

      if (userCustom && username) {
        const authorNameElement =
          liElement.querySelector(".pm-info.cf > strong") ||
          liElement.querySelector(".pm-info .autor");

        const avatarElement = liElement.querySelector("img");
        if (userCustom?.usernameCustom && authorNameElement) {
          authorNameElement.textContent = userCustom.usernameCustom;
        }
        if (userCustom?.usernameColour && authorNameElement) {
          authorNameElement.setAttribute(
            "style",
            `color: ${userCustom.usernameColour}`,
          );
        }
        if (userCustom?.avatarCustom && avatarElement) {
          avatarElement.setAttribute("src", userCustom.avatarCustom);
        }
      }
    });
  }

  if (isUserProfile() || isUserProfileSignatures()) {
    document.querySelectorAll(".firma").forEach((signature) => {
      const username =
        signature.querySelector(".firma-meta .autor")?.textContent;
      const userCustom = users.find((u) => u.username === username);
      const signatureNum = signature.getAttribute("data-id");
      const layerId = `ignored-user--layer--${signatureNum}-${username}`;
      const signatureId = `user--signature--${signatureNum}-${username}`;
      signature.id = signatureId;

      const removeLayer = () => {
        document.getElementById(signatureId)?.setAttribute("style", "");
        document.getElementById(layerId)?.remove();
      };

      if (userCustom) {
        const authorNameElement = signature.querySelector(".firma-meta a");
        const avatarElement = signature.querySelector(".firma-avatar img");

        if (userCustom?.usernameCustom && authorNameElement) {
          authorNameElement.textContent = userCustom.usernameCustom;
        }
        if (userCustom?.usernameColour && authorNameElement) {
          authorNameElement.setAttribute(
            "style",
            `color: ${userCustom.usernameColour}`,
          );
        }
        if (userCustom?.avatarCustom && avatarElement) {
          avatarElement.setAttribute("class", "avatar");
          // Small hack for lazy loaded avatars
          setTimeout(
            () =>
              userCustom.avatarCustom &&
              avatarElement.setAttribute("src", userCustom.avatarCustom),
            10,
          );
        }
      }

      if (
        username &&
        users.find((u) => u.username === username && u.isIgnored)
      ) {
        if (!document.getElementById(layerId)) {
          signature.setAttribute(
            "style",
            "height: 42px; position: relative; display: flex; overflow: hidden",
          );
          const placeholder = document.createElement("div");
          placeholder.id = layerId;
          placeholder.innerHTML = `<div class="info opacity-50 hover:opacity-100 transition !bg-inherit">Firma de <strong>${username}</strong> <button class="post-btn hiddengrp">Mostrar</button></div>`;
          placeholder.setAttribute("style", "background-color:inherit");
          placeholder.className =
            "absolute top-0 left-0 w-full h-full bg-red-500 flex items-center justify-start pl-4 cursor-pointer";
          placeholder.onclick = removeLayer;

          signature.appendChild(placeholder);
        }
      } else {
        if (document.getElementById(layerId)) {
          removeLayer();
        }
      }
    });
  }

  if (isUserProfile()) {
    const username = window.location.href.split("/")[4];
    const userCustom = users.find((u) => u.username === username);

    const authorElement = document.querySelector(".user-info h1");
    const authorImageElement = document.querySelector(".user-avatar img");
    if (userCustom?.usernameCustom && authorElement) {
      authorElement.textContent = userCustom.usernameCustom;
    }
    if (userCustom?.usernameColour && authorElement) {
      authorElement.setAttribute(
        "style",
        `color: ${userCustom.usernameColour}`,
      );
    }
    if (userCustom?.avatarCustom) {
      if (authorImageElement) {
        authorImageElement.setAttribute("src", userCustom.avatarCustom);
      } else {
        const container = document.querySelector(".user-avatar");
        const imageElement = document.createElement("img");
        imageElement.setAttribute("class", "avatar");
        imageElement.setAttribute("src", userCustom?.avatarCustom);
        if (container) {
          container.innerHTML = "";
          container.append(imageElement);
        }
      }
    }

    document.querySelectorAll("#visitas li").forEach((visit) => {
      const authorImageElement = visit.querySelector("img");
      const anchorElement = visit.querySelector("a.tooltip");
      const username = authorImageElement?.getAttribute("alt");
      const userCustom = users.find((u) => u.username === username);
      const authorElement = visit.querySelector(".user-info h1");

      if (userCustom?.usernameCustom && anchorElement && username) {
        anchorElement.setAttribute(
          "original-title",
          anchorElement
            .getAttribute("original-title")
            ?.replace(username, userCustom.usernameCustom) ?? "",
        );
      }
      if (userCustom?.usernameColour && authorElement) {
        authorElement.setAttribute(
          "style",
          `color: ${userCustom.usernameColour}`,
        );
      }
      if (userCustom?.avatarCustom && authorImageElement) {
        authorImageElement.setAttribute("src", userCustom.avatarCustom);
      }
    });
  }

  if (isThread()) {
    const parsePosts = () => {
      document.querySelectorAll(".cf.post").forEach((post) => {
        const username = post.getAttribute("data-autor");
        const userCustom = users.find((u) => u.username === username);
        const postNum = post.getAttribute("data-num");
        const newPostId = `user--post--${postNum}-${username}`;
        post.id = newPostId;

        // Customizations
        if (userCustom) {
          const authorNameElement = post.querySelector(".autor.user-card");
          const avatarElement = post.querySelector(".post-avatar img");

          if (userCustom?.usernameCustom && authorNameElement) {
            authorNameElement.textContent = userCustom.usernameCustom;
          }
          if (userCustom?.usernameColour && authorNameElement) {
            authorNameElement.setAttribute(
              "style",
              `color: ${userCustom.usernameColour}`,
            );
          }
          if (userCustom?.avatarCustom) {
            if (avatarElement) {
              avatarElement.setAttribute("class", "avatar");
              // Small hack for lazy loaded avatars
              setTimeout(
                () =>
                  userCustom.avatarCustom &&
                  avatarElement.setAttribute("src", userCustom.avatarCustom),
                10,
              );
            } else {
              const container = post.querySelector(".post-avatar .user-card");
              const imageElement = document.createElement("img");
              imageElement.setAttribute("class", "avatar");
              imageElement.setAttribute("src", userCustom?.avatarCustom);
              if (container) {
                container.innerHTML = "";
                container.append(imageElement);
              }
            }
          }
        }

        // Ignore users in post
        const layerId = `ignored-user--layer--${postNum}-${username}`;

        // We don't want to ignore op
        if (postNum === "1") {
          return;
        }

        const removeLayer = () => {
          document.getElementById(newPostId)?.setAttribute("style", "");
          document.getElementById(layerId)?.remove();
        };

        if (
          username &&
          users.find((u) => u.username === username && u.isIgnored) &&
          !post.getAttribute("data-opened")
        ) {
          if (!document.getElementById(layerId)) {
            post.setAttribute(
              "style",
              "height: 42px; position: relative; display: flex; overflow: hidden",
            );
            const placeholder = document.createElement("div");
            placeholder.id = layerId;
            placeholder.innerHTML = `<div class="info opacity-50 hover:opacity-100 transition ml-[76px] !bg-inherit">Post de <strong>${userCustom?.usernameCustom ?? username}</strong> <button class="post-btn hiddengrp">Mostrar</button></div>`;
            placeholder.setAttribute("style", "background-color:inherit");
            placeholder.className =
              "absolute top-0 left-0 w-full h-full bg-red-500 flex items-center justify-start pl-6 cursor-pointer";
            placeholder.onclick = () => {
              post.setAttribute("data-opened", "true");
              removeLayer();
            };

            post.appendChild(placeholder);
          }
        } else {
          if (document.getElementById(layerId)) {
            removeLayer();
          }
        }
      });
    };
    parsePosts();
    if (isThreadLive()) {
      setInterval(parsePosts, 150);
    }
  }
};
