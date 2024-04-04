import { create } from "zustand";
import { parseThreadsInPage } from "../domains/thread";
import { subscribeWithSelector } from "zustand/middleware";

export type MVIgnitedStore = {
  forumsLastVisited: string[];
  usersIgnored: string[];
  threadsIgnored: string[];
  customFont?: string;
};

const MEDIAVIDA_KEY = "mv-ignited::store";

const storeSet = (data: MVIgnitedStore) => {
  localStorage.setItem(MEDIAVIDA_KEY, JSON.stringify(data));
};

const storeGet = (): MVIgnitedStore | void => {
  const saved = localStorage.getItem(MEDIAVIDA_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
};

export type MVIgnitedStoreState = MVIgnitedStore & {
  update: <K extends keyof MVIgnitedStore>(
    key: K,
    data: MVIgnitedStore[K],
  ) => void;
};

export const useStore = create(
  subscribeWithSelector<MVIgnitedStoreState>((set) => ({
    usersIgnored: [],
    threadsIgnored: [],
    forumsLastVisited: [],
    ...storeGet(),
    update: (key, data) =>
      set(() => {
        return { [key]: data };
      }),
  })),
);

useStore.subscribe(
  (state) => state,
  (state) => {
    storeSet(state);
  },
);

useStore.subscribe(
  (state) => state.threadsIgnored,
  () => {
    parseThreadsInPage();
  },
);
