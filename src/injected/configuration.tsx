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

  // Cog button in navbar
  const messagesElement = usermenuElement.getElementsByClassName("f3").item(0);
  if (!messagesElement) {
    return;
  }

  const configurationButtonId = "mv-ignited--configuration-button";
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

  const menuClosedStyle =
    "transform: translateX(300px); opacity:0; pointer-events: none";
  const toggle = () => {
    const menuElement = document.getElementById(configurationMenuId);

    if (menuElement) {
      if (menuElement.getAttribute("style") === menuClosedStyle) {
        menuElement.setAttribute("style", "");
      } else {
        menuElement.setAttribute("style", menuClosedStyle);
      }
    }
  };

  configurationButtonRoot.render(<ConfigurationButton toggle={toggle} />);

  // Floating menu under navbar
  const containerMenuConfiguration = document.getElementById("topbar");
  let configurationMenuElement = document.getElementById(configurationMenuId);

  if (!configurationMenuElement) {
    containerMenuConfiguration?.insertAdjacentHTML(
      "afterend",
      `<div id='${configurationMenuId}' class="transition" style="${menuClosedStyle}"></div>`,
    );
  }

  configurationMenuElement = document.getElementById(configurationMenuId);
  if (configurationMenuElement) {
    if (!configurationMenuRoot) {
      configurationMenuRoot = createRoot(configurationMenuElement);
    }
    configurationMenuRoot.render(<ConfigurationMenu toggle={toggle} />);
  }
};
