import { createRoot } from "react-dom/client";
import React from "react";
import Home from "../react/site/home";
import { hideContent, showContent } from "./utils/loader";

export const injectHomepage = async () => {
  hideContent();
  const main = document.getElementById("main");

  if (main) {
    const root = createRoot(main);
    root.render(<Home onLoad={showContent} />);

    // Small delay fix issue with mounted dom elements not being available immediately after
    return new Promise((resolve) => setTimeout(resolve, 1));
  }
};
