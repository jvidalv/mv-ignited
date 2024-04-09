import { createRoot } from "react-dom/client";
import React from "react";
import Home from "../react/site/home";
import { hideContent, showContent } from "./utils/loader";

export const injectHomepage = () => {
  hideContent();
  const main = document.getElementById("main");

  if (main) {
    const root = createRoot(main);
    root.render(<Home onLoad={showContent} />);
  }
};
