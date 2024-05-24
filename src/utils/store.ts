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
  postBorderColour?: string;
  note?: string;
};

export enum Feature {
  NewHomepage = "newHomepage",
  NoAvatars = "noAvatars",
  NoLogo = "noLogo",
  Monospace = "monospace",
  BlackAndWhite = "blackAndWhite",
  ImprovedUpvotes = "improvedUpvotes",
}

export type MVIgnitedStore = {
  threadsIgnored: string[];
  customFont?: string;
  features: Feature[];
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
    delete store?.usersIgnored;
    // end migration 2.0.0

    return store;
  }
};

export type MVIgnitedStoreState = MVIgnitedStore & {
  update: <K extends keyof MVIgnitedStore>(
    key: K,
    data: MVIgnitedStore[K],
  ) => void;
};

export const updateUserInStore = <K extends keyof MVIgnitedStoreUser>(
  userInformation: {
    username: string;
    uid: string;
    avatar: string;
  },
  key: K,
  data: MVIgnitedStoreUser[K],
) => {
  const { update, users } = useStore.getState();

  const isUserInStore = users.some(
    (u) => u.username === userInformation.username,
  );

  if (isUserInStore) {
    return update(
      "users",
      users.map((u) => {
        if (u.username === userInformation.username) {
          return {
            ...u,
            [key]: data ? data : null,
          };
        }

        return u;
      }),
    );
  }

  return update("users", [
    ...users,
    {
      uid: userInformation.uid,
      username: userInformation.username,
      avatar: userInformation.avatar.startsWith("https")
        ? userInformation.avatar
        : `https://mediavida.b-cdn.net/img/users/avatar/${userInformation.avatar}`,
      [key]: data,
    },
  ]);
};

export const useUpdateUserInStore = <
  K extends keyof MVIgnitedStoreUser,
>(userInformation: {
  username: string;
  uid: string;
  avatar: string;
}) => {
  const { users, update } = useStore((s) => ({
    users: s.users,
    update: s.update,
  }));
  const isUserInStore = users.some(
    (u) => u.username === userInformation.username,
  );

  const onUpdateUserInStore = (key: K, data: MVIgnitedStoreUser[K]) => {
    if (isUserInStore) {
      return update(
        "users",
        users.map((u) => {
          if (u.username === userInformation.username) {
            return {
              ...u,
              [key]: data ? data : null,
            };
          }

          return u;
        }),
      );
    }

    return update("users", [
      ...users,
      {
        uid: userInformation.uid,
        username: userInformation.username,
        avatar: `https://mediavida.b-cdn.net/img/users/avatar/${userInformation.avatar}`,
        [key]: data,
      },
    ]);
  };

  return {
    onUpdateUserInStore,
  };
};

export const useStore = create(
  subscribeWithSelector<MVIgnitedStoreState>((set) => ({
    threadsIgnored: [],
    features: [],
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
  // Quick hack for changes to be detected, doesn't scale
  (state) => JSON.stringify(state.users.map((u) => JSON.stringify(u))),
  () => {
    parseUsersInPage();
  },
);

useStore.subscribe(
  // Quick hack for changes to be detected, doesn't scale
  (state) => state.features,
  () => {
    window.location.reload();
  },
);
