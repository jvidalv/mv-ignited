import { useStore } from "../utils/store";
import {
  getSubForumContainerElement,
  isFeaturedThreads,
  isHomepage,
} from "../injected/utils/loader";

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

export const ignoreThread = (threadUrl: string) => {
  const { threadsIgnored, update } = useStore.getState();
  update("threadsIgnored", [...new Set([...threadsIgnored, threadUrl])]);
  console.log(`MV-Ignited: Thread ${threadUrl} ignored`);
};

export const parseThreadsInPage = () => {
  const threadsIgnored = useStore.getState().threadsIgnored;
  const ignoredThreadsIds = threadsIgnored.map((threadUrl) =>
    getThreadId(threadUrl),
  );

  if (isHomepage()) {
    document
      .querySelectorAll(".mv-ignited--thread")
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
};
