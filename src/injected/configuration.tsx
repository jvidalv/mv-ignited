import { createRoot, Root } from "react-dom/client";
import {
  ConfigurationButton,
  ConfigurationMenu,
} from "../react/site/configuration";
import React from "react";

let configurationButtonRoot: Root | undefined;
let configurationMenuRoot: Root | undefined;

export const injectConfiguration = () => {
  const usermenuElement = document.getElementById("usermenu");
  if (!usermenuElement) {
    return;
  }

  const configurationButtonId = "mv-ignited--configuration-button";
  const configurationMenuId = "mv-ignited--configuration-menu";

  if (!configurationButtonRoot) {
    // Set positioning context for absolute positioning
    usermenuElement.style.position = "relative";

    // Inject inside #usermenu as absolutely positioned element to prevent layout shifts
    usermenuElement.insertAdjacentHTML(
      "beforeend",
      `<div id='${configurationButtonId}' style='position: absolute; right: -32px; top: 0; height: 100%; display: flex; align-items: center; z-index: 1000; pointer-events: auto;'></div>`,
    );
    const configurationButtonElement = document.getElementById(
      configurationButtonId,
    )!;

    configurationButtonRoot = createRoot(configurationButtonElement);
    configurationButtonRoot.render(<ConfigurationButton />);
  }

  // Floating menu under navbar
  const containerMenuConfiguration = document.getElementById("topbar");
  let configurationMenuElement = document.getElementById(configurationMenuId);

  if (!configurationMenuElement) {
    containerMenuConfiguration?.insertAdjacentHTML(
      "afterend",
      `<div id='${configurationMenuId}'></div>`,
    );
  }

  configurationMenuElement = document.getElementById(configurationMenuId);
  if (configurationMenuElement && !configurationMenuRoot) {
    configurationMenuRoot = createRoot(configurationMenuElement);
    configurationMenuRoot.render(<ConfigurationMenu />);
  }
};
