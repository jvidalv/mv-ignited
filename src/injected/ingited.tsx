import { createRoot } from "react-dom/client";
import React from "react";
import Ignited from "../react/site/ignited";
import { showBody } from "./utils/loader";
import { queryClient } from "../utils/query";
import { QueryClientProvider } from "@tanstack/react-query";

export const injectIgnited = () => {
  window.document.title = "Ignited | Mediavida🔥";
  const html = document.getElementsByTagName("html").item(0);

  html?.setAttribute("class", "dark");
  html?.setAttribute("prefers-color-scheme", "dark");
  showBody();
  const body = document.getElementsByTagName("body").item(0);

  if (body) {
    createRoot(body).render(
      <QueryClientProvider client={queryClient}>
        <Ignited />
      </QueryClientProvider>,
    );
  }
};
