import { mvIgniteStore } from "../../utils/store";

export const trackForumVisits = () => {
  const splitUrl = window.location.href.split("/");

  if (
    splitUrl[3] === "foro" &&
    !!splitUrl[4] &&
    !["spy", "top", "unread", "featured", "new"].includes(splitUrl[4])
  ) {
    const lastVisited = [
      splitUrl[4],
      ...(mvIgniteStore.get().forumsLastVisited ?? []),
    ];

    mvIgniteStore.set("forumsLastVisited", [...new Set(lastVisited)]);
  }
};
