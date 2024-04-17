import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type MVIgnitedCustomTheme = {
  headerColour?: string;
  pageBackground?: string;
};

const MV_IGNITED_STORE_KEY = "mv-ignited::custom-theme";

export const storeSet = (data: MVIgnitedCustomTheme) => {
  localStorage.setItem(MV_IGNITED_STORE_KEY, JSON.stringify(data));
};

export const storeGet = (): MVIgnitedCustomTheme | void => {
  const saved = localStorage.getItem(MV_IGNITED_STORE_KEY);
  if (saved) {
    const savedParsed = JSON.parse(saved);
    chrome.runtime.sendMessage(savedParsed, function (response) {
      console.log("MV-Ignited🔥 Custom theme applied 🖼️", response);
    });
    return savedParsed;
  }
};

export type MVIgnitedStoreState = MVIgnitedCustomTheme & {
  update: <K extends keyof MVIgnitedCustomTheme>(
    key: K,
    data: MVIgnitedCustomTheme[K],
  ) => void;
};

export const useCustomTheme = create(
  subscribeWithSelector<MVIgnitedStoreState>((set) => ({
    headerColour: undefined,
    pageBackground: undefined,
    ...(storeGet() ?? {}),
    update: (key, data) =>
      set(() => {
        return { [key]: data };
      }),
  })),
);

useCustomTheme.subscribe(
  (state) => state,
  (state) => {
    storeSet(state);
    chrome.runtime.sendMessage(state, function (response) {
      console.log("MV-Ignited🔥 Custom theme updated 🖼️", response);
    });
  },
);
