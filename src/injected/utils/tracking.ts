import { setLatestVisitedForums } from "../../domains/forum";

export const trackForumVisits = () => {
  const splitUrl = window.location.href.split("/");

  if (
    splitUrl[3] === "foro" &&
    !!splitUrl[4] &&
    !["spy", "top", "unread", "featured", "new"].includes(splitUrl[4])
  ) {
    setLatestVisitedForums(splitUrl[4].split("?")[0]);
  }
};
