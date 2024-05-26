import { Feature, useStore } from "../utils/store";
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

      // Stuff in spoiler
      const wrapInSpoiler = (element: Element, type: string) => {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "spoiler-wrap");
        wrapper.innerHTML = `<a href="#" title="Click para desplegar" class="spoiler">${type}</a><div class="spoiler animated" style="display:none">${element?.outerHTML}</div>`;
        element.replaceWith(wrapper);
      };

      const features = useStore.getState().features;

      if (features.includes(Feature.TwitterInSpoiler)) {
        const twitts = postElement.querySelectorAll(".embed.twitter");
        twitts.forEach((element) => wrapInSpoiler(element, " Ver twit 🐥"));
      }

      if (features.includes(Feature.YoutubeInSpoiler)) {
        const videos = postElement.querySelectorAll(".embed.yt");
        videos.forEach((element) => wrapInSpoiler(element, " Ver video 📹"));
      }

      if (features.includes(Feature.ImagesInSpoiler)) {
        const images = postElement.querySelectorAll(
          ".post-contents > p img:not(.emoji)",
        );
        images.forEach((element) => {
          if (element.parentElement) {
            wrapInSpoiler(element.parentElement, " Ver imagen 🏞️");
          }
        });
      }

      if (features.includes(Feature.RandomMediaInSpoiler)) {
        const embeds = postElement.querySelectorAll(
          ".embed:not(.twitter,.yt,[data-s9e-mediaembed='streamable'])",
        );
        embeds.forEach((element) =>
          wrapInSpoiler(element, " Ver contenido insertado 🎲"),
        );
      }
    });
  };

  parsePosts();

  if (isThreadLive()) {
    setInterval(parsePosts, 150);
  }
};
