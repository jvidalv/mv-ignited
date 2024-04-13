import { useStore } from "../utils/store";
import { isThreadLive } from "../injected/utils/loader";

export const parseUsersInPage = () => {
  const { usersIgnored, users } = useStore.getState();
  // Notifications @todo

  // Messages @todo

  // Signatures
  const signatures = document.querySelectorAll(".firma") ?? [];
  Array.from(signatures).forEach((signature) => {
    const username = signature.querySelector(".firma-meta .autor")?.textContent;
    const signatureNum = signature.getAttribute("data-id");
    const layerId = `ignored-user--layer--${signatureNum}-${username}`;
    const signatureId = `user--signature--${signatureNum}-${username}`;
    signature.id = signatureId;

    const removeLayer = () => {
      document.getElementById(signatureId)?.setAttribute("style", "");
      document.getElementById(layerId)?.remove();
    };

    if (username && usersIgnored.includes(username)) {
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

  // Posts
  const parsePosts = () => {
    const usersIgnored = useStore.getState().usersIgnored;
    const posts = document.querySelectorAll(".cf.post") ?? [];

    Array.from(posts).forEach((post) => {
      const username = post.getAttribute("data-autor");
      const userCustom = users.find((u) => u.username === username);
      const postNum = post.getAttribute("data-num");
      const newPostId = `user--post--${postNum}-${username}`;
      post.id = newPostId;

      // CUSTOMIZATIONS
      if (userCustom) {
        const authorNameElement = post.querySelector(".autor.user-card");
        const avatarElement = post.querySelector(".user-card img.avatar");

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
          avatarElement.setAttribute("class", "avatar");
        }
      }

      // START IGNORING USERS FEAT.
      const layerId = `ignored-user--layer--${postNum}-${username}`;
      // We don't want to ignore 1
      if (postNum === "1") {
        return;
      }

      const removeLayer = () => {
        document.getElementById(newPostId)?.setAttribute("style", "");
        document.getElementById(layerId)?.remove();
      };

      if (
        username &&
        (usersIgnored.includes(username) ||
          users.find((u) => u.username === username && u.isIgnored)) &&
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
      // END IGNORING USERS FEAT.
    });
  };

  parsePosts();

  if (isThreadLive()) {
    setInterval(parsePosts, 150);
  }
};
