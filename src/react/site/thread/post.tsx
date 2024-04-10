import React from "react";
import { getUsername } from "../../../injected/utils/data";
import clsx from "clsx";
import { Tooltip } from "../components/ui";

const getColour = (numberOfUpvotes: number) => {
  if (numberOfUpvotes < 20) {
    return "text-gray-500 dark:text-gray-400";
  }
  if (numberOfUpvotes < 100) {
    return "text-orange-500 dark:text-orange-500";
  }

  return "text-purple-500 dark:text-purple-500";
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
        className="flex -space-x-3 rtl:space-x-reverse filter opacity-75"
      >
        {Array.from({ length: numberOfUpvotes })
          .filter((_, i) => i < 5)
          .map((_, i) => (
            <div
              key={i}
              className="animate-pulse w-6 h-6 bg-surface relative flex items-center justify-center border-2 rounded-full"
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
          "flex -space-x-3 opacity-75 hover:opacity-100 transition duration-300",
          haveYouVoted && "[&>img]:grayscale-0 opacity-100",
        )}
      >
        {upvotes
          .reverse()
          ?.filter((_, i) => i < 5)
          .map(({ username, avatar }) => (
            <Tooltip key={username} content={username}>
              <img
                key={username}
                className="w-6 h-6 relative bg-surface rounded-full hover:-translate-y-0.5 duration-200 transition"
                src={avatar}
                alt={username}
                title={username}
              />
            </Tooltip>
          ))}
      </div>
      <div className={getColour(numberOfUpvotes)}>{numberOfUpvotes}</div>
    </div>
  );
};
