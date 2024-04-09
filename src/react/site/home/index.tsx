import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Threads from "../components/threads";
import { getIconClassBySlug } from "../utils/forums";
import { useStore } from "../../../utils/store";
import {
  getFavorites,
  getForumLastThreads,
  getLastNews,
  getUsername,
  getUserLastPosts,
} from "../../../injected/utils/data";
import { Thread } from "../../../domains/thread";

function Home({ onLoad }: { onLoad: () => void }) {
  const [favorites, setFavorites] = useState<Thread[]>();
  const [lastThreads, setLastThreads] = useState<Thread[]>();
  const [lastNews, setLastNews] = useState<Thread[]>();
  const [userLastPosts, setUserLastPosts] = useState<Thread[]>();

  const { forumsLastVisited } = useStore();

  useEffect(() => {
    const loadHomePageData = async () => {
      const lastThreads = await getForumLastThreads();
      setLastThreads(lastThreads);

      const userLastPosts = await getUserLastPosts(getUsername());
      setUserLastPosts(userLastPosts);

      const favorites = await getFavorites();
      setFavorites(favorites);

      const lastNews = await getLastNews();
      setLastNews(lastNews);
    };

    loadHomePageData();
    onLoad();
  }, []);

  return (
    <div className={clsx("py-2")}>
      <div className="flex items-end justify-between">
        <h1>Noticias</h1>
        <a href="/p2">Siguientes</a>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {lastNews
          ?.filter((_, i) => i < 5)
          .map((thread) => {
            return (
              <div
                key={thread.url}
                className="flex flex-col bg-opacity-90 justify-end h-44 w-full rounded shadow"
                style={{
                  backgroundImage: `url(${thread.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="min-h-12 bg-surface w-full p-2">
                  <div className="flex items-start gap-2">
                    <a
                      className="hover:scale-125 duration-200 transition"
                      href={`/foro/${thread.forumSlug}`}
                    >
                      <i
                        className={clsx(
                          "fid",
                          getIconClassBySlug(thread.forumSlug)
                        )}
                      />
                    </a>
                    <a
                      href={thread.url}
                      title={thread.title}
                      className="text-sm font-medium line-clamp-2 text-primary min-h-[40px]  hover:underline"
                    >
                      {thread.title}
                    </a>
                  </div>
                  <div className="text-gray-400 dark:text-gray-600 text-right mt-2">
                    {thread.createdAt}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="grid grid-cols-3 gap-8 mt-10">
        <div className="col-span-2">
          <div className="flex items-end justify-between -mt-[0.3rem]">
            <h1>Foro</h1>
            <div
              className="flex items-center gap-2"
              title="Últimos foros visitados"
            >
              {!!forumsLastVisited?.length &&
                forumsLastVisited
                  .filter((_, i) => i < 8)
                  .map((forumSlug) => (
                    <a
                      key={forumSlug}
                      className="hover:scale-125 duration-200 transition"
                      href={`/foro/${forumSlug}`}
                    >
                      <i
                        className={clsx("fid", getIconClassBySlug(forumSlug))}
                      />
                    </a>
                  ))}
            </div>
          </div>
          <Threads.Root className="mt-3">
            {lastThreads?.map((thread) => {
              return <Threads.Thread key={thread.url} {...thread} />;
            })}
          </Threads.Root>
        </div>
        <div>
          <div className="flex items-end justify-between">
            <h2>Tus últimos posts </h2>
            <a href={`/id/${getUsername()}/posts`}>Todos</a>
          </div>
          <Threads.Root className="mt-3">
            {userLastPosts
              ?.filter((f, i) => i < 6)
              .map((thread) => {
                return <Threads.Thread key={thread.url} {...thread} />;
              })}
          </Threads.Root>
          <div className="flex items-end justify-between mt-4">
            <h2>Favoritos</h2>
            <a href="/foro/favoritos">Todos</a>
          </div>
          <Threads.Root className="mt-3">
            {favorites
              ?.filter((f, i) => f.responsesSinceLastVisit && i < 6)
              .map((favorite) => {
                return <Threads.Thread key={favorite.url} {...favorite} />;
              })}
          </Threads.Root>
        </div>
      </div>
    </div>
  );
}

export default Home;
