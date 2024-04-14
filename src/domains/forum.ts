const LATEST_VISITED_FORUMS_KEY = "mv-ignited::latest-visited-forums";

export const setLatestVisitedForums = (forum: string) => {
  const latestVisitedForums = getLatestVisitedForums();
  localStorage.setItem(
    LATEST_VISITED_FORUMS_KEY,
    JSON.stringify([...new Set([forum, ...(latestVisitedForums ?? [])])]),
  );
};

export const getLatestVisitedForums = (): string[] =>
  JSON.parse(localStorage.getItem(LATEST_VISITED_FORUMS_KEY) ?? "[]");
