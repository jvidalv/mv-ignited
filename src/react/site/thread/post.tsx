import React from "react";
import { getUsername } from "../../../injected/utils/data";
import clsx from "clsx";

const getColour = (numberOfUpvotes: number) => {
  if (numberOfUpvotes < 20) {
    return "";
  }
  if (numberOfUpvotes < 100) {
    return "text-orange-400 dark:text-orange-300";
  }
  return "text-purple-500 dark:text-purple-400";
};

export const UpvotesLoadingInPost = ({
  numberOfUpvotes,
}: {
  numberOfUpvotes: number;
}) => {
  if (!numberOfUpvotes) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      <div
        title="Ver todas las manitas"
        className="flex -space-x-3 rtl:space-x-reverse [&>img]:grayscale [&:hover>img]:grayscale-0 filter opacity-75"
      >
        {Array.from({ length: numberOfUpvotes })
          .filter((_, i) => i < 5)
          .map((_, i) => (
            <div
              key={i}
              style={{
                borderWidth: "0.5px",
                borderStyle: "solid",
              }}
              className="animate-pulse w-6 h-6 bg-surface border-surface relative flex items-center justify-center border-2 rounded-full"
            />
          ))}
      </div>
      <div className={getColour(numberOfUpvotes)}>{numberOfUpvotes}</div>
    </div>
  );
};

export const UpvotesInPost = ({
  numberOfUpvotes,
  upvotes,
}: {
  numberOfUpvotes: number;
  upvotes: {
    avatar: string;
    url: string;
    username: string;
  }[];
}) => {
  const haveYouVoted = upvotes
    .map((u) => u.username)
    .includes(getUsername() ?? "");

  if (!numberOfUpvotes) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      <div
        title="Ver todas las manitas"
        className={clsx(
          "flex -space-x-3 opacity-75 [&>img]:grayscale [&:hover>img]:grayscale-0 filter hover:opacity-100 transition duration-300",
          haveYouVoted && "[&>img]:grayscale-0 opacity-100",
        )}
      >
        {upvotes
          .reverse()
          ?.filter((_, i) => i < 5)
          .map(({ username, avatar }) => (
            <img
              key={username}
              style={{
                borderWidth: "0.5px",
                borderStyle: "solid",
              }}
              className="w-6 h-6 relative border-surface bg-surface rounded-full hover:-translate-y-0.5 duration-200 transition"
              src={avatar}
              alt={username}
              title={username}
            />
          ))}
      </div>
      <div className={getColour(numberOfUpvotes)}>{numberOfUpvotes}</div>
    </div>
  );
};
