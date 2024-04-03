import { mvIgniteStore } from "../utils/store";
import {
  getSubForumContainerElement,
  isFeaturedThreads,
  isHomepage,
} from "../injected/utils/loader";
import { rerenderConfigurationMenuRoot } from "../injected/configuration";

export type Thread = {
  url: string;
  forumSlug: string;
  title: string;
  thumbnail?: string;
  hasLive?: boolean;
  urlSinceLastVisit?: string | null;
  responsesSinceLastVisit?: number;
  userResponseAt?: string | null;
  lastActivityAt?: string;
  createdAt?: string;
  totalResponses?: string;
  userLastResponse?: {
    username: string;
    avatar: string;
  };
};

export const getThreadId = (threadUrl: string) => {
  const urlSplit = threadUrl.split("-");
  return urlSplit[urlSplit.length - 1];
};

export const addThreadToIgnore = (threadUrl: string) => {
  const ignoredThreads = mvIgniteStore.get().ignoredThreads ?? [];
  ignoredThreads.push(threadUrl);
  mvIgniteStore.set("ignoredThreads", [...new Set(ignoredThreads)]);

  ignoreThreads();
  // this is a hack, should be better implemented
  rerenderConfigurationMenuRoot();
  console.log(`MV-Ignited: Thread ${threadUrl} ignored`);
};

export const ignoreThreads = () => {
  const ignoredThreads = mvIgniteStore.get().ignoredThreads;
  const ignoredThreadsIds = ignoredThreads.map((threadUrl) =>
    getThreadId(threadUrl),
  );

  if (ignoredThreads.length) {
    if (isHomepage()) {
      document
        .querySelectorAll(".mv-ignite--thread")
        ?.forEach((threadElement) => {
          const idSplit = threadElement.id?.split("-");
          if (ignoredThreadsIds.includes(idSplit[idSplit.length - 1])) {
            threadElement?.setAttribute("style", "display:none");
          } else {
            threadElement?.setAttribute("style", "");
          }
        });
    }

    if (isFeaturedThreads()) {
      document.querySelectorAll("a")?.forEach((a) => {
        const thread = document.getElementById(`t${a.id.slice(1)}`);
        if (ignoredThreadsIds.includes(a.id.slice(1))) {
          thread?.setAttribute("style", "display:none");
        } else {
          thread?.setAttribute("style", "");
        }
      });
    }

    const temasElement = getSubForumContainerElement();
    if (temasElement) {
      for (const a of document.querySelectorAll("a")) {
        const thread = document.getElementById(`a${a.id.slice(1)}`);
        const trElement = thread?.parentElement?.parentElement?.parentElement;

        if (ignoredThreadsIds.includes(a.id.slice(1))) {
          trElement?.setAttribute("style", "display:none");
        } else {
          trElement?.setAttribute("style", "");
        }
      }
    }
  }
};
