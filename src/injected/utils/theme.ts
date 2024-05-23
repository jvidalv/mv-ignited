import { Feature, useStore } from "../../utils/store";
import clsx from "clsx";

export const injectTheme = () => {
  const classes = [];

  const isLotr = document.querySelector('link[href$="/lotr.css"]');
  const isDark = document.querySelector('link[href$="/dark_v7.css"]');
  const isFire = document.querySelector('link[href$="/fire.css"]');
  const isGhost = document.querySelector('link[href$="/ghost.css"]');
  const isEmpire = document.querySelector('link[href$="/empire.css"]');

  const html = document.getElementsByTagName("html").item(0);
  if (isLotr || isDark || isFire || isGhost || isEmpire) {
    classes.push("dark");
    html?.setAttribute("prefers-color-scheme", "dark");
  }

  const features = useStore.getState().features;
  const hasNoAvatars = features.includes(Feature.NoAvatars);
  const hasNoLogo = features.includes(Feature.NoLogo);
  const hasMonospace = features.includes(Feature.Monospace);
  const hasBlackAndWhite = features.includes(Feature.BlackAndWhite);
  if (hasNoAvatars) {
    classes.push("no-avatars");
  }
  if (hasNoLogo) {
    classes.push("no-logo");
  }
  if (hasMonospace) {
    classes.push("monospace");
  }
  if (hasBlackAndWhite) {
    classes.push("black-and-white");
  }
  html?.setAttribute("class", clsx(...classes));
};
