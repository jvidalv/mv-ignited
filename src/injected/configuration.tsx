import { createRoot, Root } from "react-dom/client";
import {
  ConfigurationButton,
  ConfigurationMenu,
} from "../react/site/configuration";
import React from "react";

let configurationButtonRoot: Root | undefined;
let configurationMenuRoot: Root | undefined;

export const rerenderConfigurationMenuRoot = () => {
  configurationMenuRoot?.render(<ConfigurationMenu />);
};

export const injectConfiguration = () => {
  const usermenuElement = document.getElementById("usermenu");
  if (!usermenuElement) {
    return;
  }

  // Cog button in navbar
  const messagesElement = usermenuElement.getElementsByClassName("f3").item(0);
  if (!messagesElement) {
    return;
  }

  const configurationButtonId = "mv-ignite--configuration-button";
  const configurationMenuId = "mv-ignited--configuration-menu";

  if (!configurationButtonRoot) {
    messagesElement.insertAdjacentHTML(
      "afterend",
      `<li class='f4' id='${configurationButtonId}' style='height:100%'></li>`,
    );
    const configurationButtonElement = document.getElementById(
      configurationButtonId,
    )!;

    configurationButtonRoot = createRoot(configurationButtonElement);
  }
  configurationButtonRoot.render(
    <ConfigurationButton configurationMenuId={configurationMenuId} />,
  );

  // Floating menu under navbar
  const containerMenuConfiguration = document.getElementById("topbar");
  let configurationMenuElement = document.getElementById(configurationMenuId);

  if (!configurationMenuElement) {
    containerMenuConfiguration?.insertAdjacentHTML(
      "afterend",
      `<div id='${configurationMenuId}' style='opacity:0; pointer-events: none'></div>`,
    );
  }

  configurationMenuElement = document.getElementById(configurationMenuId);
  if (configurationMenuElement) {
    if (!configurationMenuRoot) {
      configurationMenuRoot = createRoot(configurationMenuElement);
    }
    configurationMenuRoot.render(<ConfigurationMenu />);
  }
};
