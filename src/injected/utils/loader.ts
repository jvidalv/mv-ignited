export const showBody = () => {
  const body = document.getElementsByTagName("body").item(0);
  body?.setAttribute("style", "opacity: 1 !important;");
};

export const showContent = () => {
  const content = document.getElementById("content");
  content?.setAttribute("style", "opacity: 1 !important;");
};
export const hideContent = () => {
  const content = document.getElementById("content");
  content?.setAttribute("style", "opacity: 0 !important;");
};

export const isHomepage = () => !!document.getElementById("index");
export const isIgnitedPage = () =>
  window.location.href.startsWith("https://www.mediavida.com/ignited");
export const isUserProfile = () => !!document.getElementById("perfil");
export const isUserProfileSignatures = () =>
  !!document.getElementById("firmas");
export const isMessages = () => !!document.getElementById("mensajes");
export const isThread = () => !!document.getElementById("posts-wrap");
export const isThreadLive = () => !!document.getElementById("live");
export const getSubForumContainerElement = () =>
  document.getElementById("temas");
export const isSubForumThreads = () => !!getSubForumContainerElement();
export const isFeaturedThreads = () =>
  document.getElementById("top") ||
  document.getElementById("foros_spy") ||
  document.getElementById("featured") ||
  document.getElementById("unread") ||
  document.getElementById("new");
