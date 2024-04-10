import { useStore } from "../utils/store";

export const parseUsersInPage = () => {
  const usersIgnored = useStore.getState().usersIgnored;
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
        placeholder.innerHTML = `<div class="opacity-50 hover:opacity-100 transition">Firma de <strong>${username}</strong></div>`;
        placeholder.setAttribute("style", "background-color:inherit");
        placeholder.className =
          "absolute top-0 left-0 w-full h-full bg-red-500 flex items-center justify-start pl-6 cursor-pointer hover:underline";
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
  const posts = document.querySelectorAll(".cf.post") ?? [];
  Array.from(posts).forEach((post) => {
    const username = post.getAttribute("data-autor");
    const postNum = post.getAttribute("data-num");
    const layerId = `ignored-user--layer--${postNum}-${username}`;
    const newPostId = `user--post--${postNum}-${username}`;
    post.id = newPostId;

    // We don't want to ignore 1
    if (postNum === "1") {
      return;
    }

    const removeLayer = () => {
      document.getElementById(newPostId)?.setAttribute("style", "");
      document.getElementById(layerId)?.remove();
    };

    if (username && usersIgnored.includes(username)) {
      if (!document.getElementById(layerId)) {
        post.setAttribute(
          "style",
          "height: 42px; position: relative; display: flex; overflow: hidden",
        );
        const placeholder = document.createElement("div");
        placeholder.id = layerId;
        placeholder.innerHTML = `<div class="info opacity-50 hover:opacity-100 transition ml-[76px] !bg-inherit">Post de <strong>${username}</strong> <button class="post-btn hiddengrp">Mostrar</button></div>`;
        placeholder.setAttribute("style", "background-color:inherit");
        placeholder.className =
          "absolute top-0 left-0 w-full h-full bg-red-500 flex items-center justify-start pl-6 cursor-pointer";
        placeholder.onclick = removeLayer;

        post.appendChild(placeholder);
      }
    } else {
      if (document.getElementById(layerId)) {
        removeLayer();
      }
    }
  });
};
