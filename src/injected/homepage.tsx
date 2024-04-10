import { createRoot } from "react-dom/client";
import React from "react";
import Home from "../react/site/home";
import { hideContent, showContent } from "./utils/loader";
import { asyncStoragePersister, queryClient } from "../utils/query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

export const injectHomepage = () => {
  hideContent();
  const main = document.getElementById("main");

  if (main) {
    const root = createRoot(main);
    root.render(
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <Home onLoad={showContent} />
      </PersistQueryClientProvider>
    );
  }
};
