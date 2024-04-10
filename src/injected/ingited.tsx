import { createRoot } from "react-dom/client";
import React from "react";
import Ignited from "../react/site/ignited";
import { showBody, showContent } from "./utils/loader";
import { asyncStoragePersister, queryClient } from "../utils/query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

export const injectIgnited = () => {
  window.document.title = "Ignited | Mediavida🔥";
  showBody();
  const body = document.getElementsByTagName("body").item(0);
  if (body) {
    createRoot(body).render(
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <Ignited onLoad={showContent} />
      </PersistQueryClientProvider>,
    );
  }
};
