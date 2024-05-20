import { Feature, useStore } from "../../utils/store";
import clsx from "clsx";

export const injectTheme = () => {
  const hasWorkMode = useStore.getState().features.includes(Feature.WorkMode);

  const isLotr = document.querySelector('link[href$="/lotr.css"]');
  const isDark = document.querySelector('link[href$="/dark_v7.css"]');
  const isFire = document.querySelector('link[href$="/fire.css"]');
  const isGhost = document.querySelector('link[href$="/ghost.css"]');
  const isEmpire = document.querySelector('link[href$="/empire.css"]');

  if (isLotr || isDark || isFire || isGhost || isEmpire) {
    const html = document.getElementsByTagName("html").item(0);

    html?.setAttribute("class", clsx("dark", hasWorkMode && "work-mode"));
    html?.setAttribute("prefers-color-scheme", "dark");
  }
};
