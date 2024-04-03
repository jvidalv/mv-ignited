export type MVIgniteStore = {
  forumsLastVisited: string[];
  ignoredUsers: string[];
  ignoredThreads: string[];
  customFont?: string;
};

const MEDIAVIDA_KEY = "mv-ignited::store";

const set = <K extends keyof MVIgniteStore>(key: K, data: MVIgniteStore[K]) => {
  const json = get();
  localStorage.setItem(MEDIAVIDA_KEY, JSON.stringify({ ...json, [key]: data }));
};

const get = (): MVIgniteStore =>
  JSON.parse(
    localStorage.getItem(MEDIAVIDA_KEY) ??
      JSON.stringify({
        forumsLastVisited: [],
        ignoredUsers: [],
        ignoredThreads: [],
      }),
  );

export const mvIgniteStore = {
  set,
  get,
};
