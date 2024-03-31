import { mvstore } from "../../utils/json";

export const trackForumVisits = () => {
  const splitUrl = window.location.href.split("/");

  if (splitUrl[3] === "foro" && !!splitUrl[4]) {
    const lastVisited = [
      splitUrl[4],
      ...(mvstore.get().forumsLastVisited ?? []),
    ];

    mvstore.set("forumsLastVisited", [...new Set(lastVisited)]);
  }
};
