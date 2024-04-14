import { create } from "zustand";
import { parseThreadsInPage } from "../domains/thread";
import { subscribeWithSelector } from "zustand/middleware";
import { parseUsersInPage } from "../domains/user";

export type MVIgnitedStoreUser = {
  uid: string;
  username: string;
  usernameCustom?: string;
  usernameColour?: string;
  isIgnored?: boolean;
  avatar: string;
  avatarCustom?: string;
};

export type MVIgnitedStore = {
  usersIgnored: string[];
  threadsIgnored: string[];
  customFont?: string;
  users: MVIgnitedStoreUser[];
};

const MV_IGNITED_STORE_KEY = "mv-ignited::store";

export const storeSet = (data: MVIgnitedStore) => {
  localStorage.setItem(MV_IGNITED_STORE_KEY, JSON.stringify(data));
};

export const storeGet = (): MVIgnitedStore | void => {
  const saved = localStorage.getItem(MV_IGNITED_STORE_KEY);
  if (saved) {
    const store = JSON.parse(saved);
    // Migration 2.0.0
    delete store?.forumsLastVisited;

    return store;
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
    users: [],
    ...(storeGet() ?? {}),
    update: (key, data) =>
      set(() => {
        return { [key]: data };
      }),
  })),
);

useStore.subscribe(
  (state) => state,
  (state) => {
    console.log("MV-Ignited🔥 state change:", state);
    storeSet(state);
  },
);

useStore.subscribe(
  (state) => state.threadsIgnored,
  () => {
    parseThreadsInPage();
  },
);

useStore.subscribe(
  (state) => state.usersIgnored,
  () => {
    parseUsersInPage();
  },
);
