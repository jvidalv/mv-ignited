import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { getIconClassBySlug } from "../utils/forums";
import { Thread } from "../../../domains/thread";

const Root = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx(className, "grid grid-cols-5 gap-2")}>{children}</div>
);

const NewsItem = ({ url, forumSlug, title, thumbnail, createdAt }: Thread) => {
  return (
    <div
      key={url}
      className="flex flex-col bg-opacity-90 justify-end h-44 w-full rounded shadow"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-12 bg-surface w-full p-2">
        <div className="flex items-start gap-2">
          <a
            className="hover:scale-125 duration-200 transition"
            href={`/foro/${forumSlug}`}
          >
            <i className={clsx("fid", getIconClassBySlug(forumSlug))} />
          </a>
          <a
            href={url}
            title={title}
            className="text-sm font-medium line-clamp-2 text-primary min-h-[40px]  hover:underline"
          >
            {title}
          </a>
        </div>
        <div className="text-gray-400 dark:text-gray-600 text-right mt-2">
          {createdAt}
        </div>
      </div>
    </div>
  );
};

const NewsItemSkeleton = () => {
  return (
    <div className="flex flex-col justify-end min-h-44 bg-surface animate-pulse" />
  );
};

const NewsItemList = ({
  threads,
  loading,
  maxThreads,
}: {
  className?: string;
  threads?: Thread[];
  loading: boolean;
  maxThreads: number;
}) => {
  return (
    <>
      {loading
        ? [...Array(maxThreads).keys()].map((i) => (
            <News.NewsItemSkeleton key={i} />
          ))
        : threads
            ?.filter((_, i) => i < maxThreads)
            .map((thread) => {
              return <News.NewsItem key={thread.url} {...thread} />;
            })}
    </>
  );
};

const News = {
  Root,
  NewsItem,
  NewsItemSkeleton,
  NewsItemList,
};

export default News;
