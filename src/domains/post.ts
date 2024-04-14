import { useStore } from "../utils/store";
import { isThreadLive } from "../injected/utils/loader";

export const parsePostsInPage = () => {
  const parsePosts = () => {
    const users = useStore.getState().users;
    document.querySelectorAll(".cf.post").forEach((postElement) => {
      const username = postElement.getAttribute("data-autor");
      if (username) {
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
