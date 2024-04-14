import { useStore } from "../utils/store";
import { isThreadLive } from "../injected/utils/loader";

export const parsePostsInPage = () => {
  const parsePosts = () => {
    const users = useStore.getState().users;
    document.querySelectorAll(".cf.post").forEach((postElement) => {
      const username = postElement.getAttribute("data-autor");
      // Modify online indicator
      const onlineElement = postElement.querySelector(".autor.user-card.on");
      const isOnline = !!onlineElement;
      if (isOnline) {
        onlineElement.className = "autor user-card";
        const userCardElement = postElement.querySelector(".post-avatar");
        if (userCardElement) {
          userCardElement.setAttribute("style", "position: relative");
          const newOnlineElement = document.createElement("div");
          newOnlineElement.setAttribute(
            "style",
            "top:-4px; left: -4px; position: absolute; background: #7cba00; width: 9px; height: 9px; border-radius: 9999px",
          );
          userCardElement.append(newOnlineElement);
        }
      }

      if (username) {
        // Customizations
        const userInStore = users.find((u) => u.username === username);
        if (userInStore) {
          if (userInStore.postBorderColour) {
            postElement.setAttribute(
              "style",
              `border: 1px solid ${userInStore.postBorderColour}`,
            );
          }
        }
      }
    });
  };

  parsePosts();

  if (isThreadLive()) {
    setInterval(parsePosts, 150);
  }
};
