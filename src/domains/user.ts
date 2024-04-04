import { useStore } from "../utils/store";

export const parseUsersInPage = () => {
  const usersIgnored = useStore.getState().usersIgnored;
  // Notifications

  // Messages

  // Signatures

  // Posts
  const posts = document.querySelectorAll(".cf.post") ?? [];
  Array.from(posts).forEach((post) => {
    const username = post.getAttribute("data-autor");
    const postNum = post.getAttribute("data-num");
    const newPostId = `user--post--${postNum}-${username}`;
    post.id = newPostId;
    const layerId = `ignored-user--layer--${postNum}-${username}`;

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
        placeholder.innerHTML = `<div class="opacity-50 hover:opacity-100 transition">Post de <strong>${username}</strong></div>`;
        placeholder.setAttribute("style", "background-color:inherit");
        placeholder.className =
          "absolute top-0 left-0 w-full h-full bg-red-500 flex items-center justify-start pl-6 cursor-pointer hover:underline";
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
