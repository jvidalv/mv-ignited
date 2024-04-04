import { useStore } from "../../utils/store";

export const trackForumVisits = () => {
  const splitUrl = window.location.href.split("/");
  const { forumsLastVisited, update } = useStore.getState();

  if (
    splitUrl[3] === "foro" &&
    !!splitUrl[4] &&
    !["spy", "top", "unread", "featured", "new"].includes(splitUrl[4])
  ) {
    update("forumsLastVisited", [
      ...new Set([splitUrl[4], ...(forumsLastVisited ?? [])]),
    ]);
  }
};
