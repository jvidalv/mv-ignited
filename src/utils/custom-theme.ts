import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type MVIgnitedCustomTheme = {
  customWidth?: string;
  headerColour?: string;
  pageBackground?: string;
  primaryColour?: string;
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
      console.log(
        "MV-Ignited🔥 Custom theme applied 🖼️",
        savedParsed,
        response,
      );
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
    customWidth: undefined,
    headerColour: undefined,
    pageBackground: undefined,
    primaryColour: undefined,
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

export const isValidCSSSize = (size: string) => {
  const validSizeRegex = /^\d+(\.\d+)?(px|em|rem|vh|vw|%|in|cm|mm|pt|pc)$/i;
  if (!validSizeRegex.test(size)) {
    return false;
  }

  const numericValue = parseFloat(size);

  return numericValue >= 800 && numericValue <= window.screen.availWidth;
};
