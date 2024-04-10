import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});
