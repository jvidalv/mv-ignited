import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { getIconClassBySlug } from "../utils/forums";
import { ignoreThread, getThreadId, Thread } from "../../../domains/thread";

const abbrevNumberToInt = (str: string) => {
  const match = str.match(/^(\d+(\.\d+)?)([kK])?$/);
  if (!match) {
    return 0;
  }

  const numPart = parseFloat(match[1]);
  const unit = match[3];

  switch (unit) {
    case "k":
    case "K":
      return Math.round(numPart * 1000);
    default:
      return Math.round(numPart);
  }
};

const Root = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx(className, "grid grid-cols-1 shadow gap-y-0.5 rounded")}>
    {children}
  </div>
);

const Thread = (props: Thread) => {
  const {
    url,
    urlSinceLastVisit,
    title,
    lastActivityAt,
    responsesSinceLastVisit,
    totalResponses,
    hasLive,
    forumSlug,
  } = props;

  const totalResponsesAsInt = totalResponses
    ? abbrevNumberToInt(totalResponses)
    : 0;

  return (
    <div
      id={`mv-ignite--thread-${getThreadId(url)}`}
      className="mv-ignite--thread flex justify-between relative bg-surface first:rounded-t last:rounded-b"
    >
      <button
        className="mv-ignite--thread--button-ignore opacity-0 h-full w-8 -left-8 absolute text-gray-500 hover:scale-125 transition"
        onClick={() => ignoreThread(url)}
        title={`Ignorar hilo: ${title}`}
      >
        <i className="fa fa-eye-slash"></i>
        <span className="sr-only">Ignorar hilo</span>
      </button>
      <div className="flex cursor-pointer flex-1 items-center gap-2 p-2 hover:bg-opacity-50 transition duration-150">
        <a
          href={`https://www.mediavida.com/foro/${forumSlug}`}
          title={`Ir a ${forumSlug}`}
          className="hover:scale-125 transition duration-150"
        >
          <i className={clsx("fid", getIconClassBySlug(forumSlug))} />
        </a>
        <a
          href={url}
          className="flex-1 line-clamp-2 hover:underline"
          title={`Ir al inicio de ${title}`}
        >
          {title}
        </a>
        <div className="flex items-center justify-center gap-2 mr-2">
          {hasLive && (
            <a
              href={`${url}/live`}
              title="Ir al live"
              className="hover:scale-125 transition duration-200 mr-1 bg-red-500 text-white rounded-xs px-0.5 w-3 h-3 rounded-full hover:bg-opacity-75"
            />
          )}
          <div
            title="Total respuestas"
            className={clsx(
              "w-8 text-right",
              totalResponsesAsInt < 100 && "text-gray-400 dark:text-gray-600",
              totalResponsesAsInt >= 100 && "text-gray-600 dark:text-gray-400",
              totalResponsesAsInt > 1000 &&
                "text-orange-500 dark:text-orange-500",
              totalResponsesAsInt > 10000 &&
                "text-purple-500 dark:text-purple-500",
            )}
          >
            {totalResponses}
          </div>
          <div
            title="Tiempo desde el úlitmo mensaje"
            className="w-8 text-right text-gray-500"
          >
            {lastActivityAt}
          </div>
        </div>
      </div>
      {!!responsesSinceLastVisit && !!urlSinceLastVisit ? (
        <a
          title="Respuestas desde la última visita"
          href={urlSinceLastVisit}
          className={clsx(
            "w-10 cursor-pointer hover:bg-opacity-75 transition duration-200 text-white text-xs font-medium flex items-center justify-center",
            responsesSinceLastVisit < 10 && "bg-blue-400",
            responsesSinceLastVisit >= 10 && "bg-blue-500",
            responsesSinceLastVisit > 30 && "bg-orange-500",
            responsesSinceLastVisit > 99 && "bg-red-500",
          )}
        >
          {responsesSinceLastVisit > 99 ? "+99" : responsesSinceLastVisit}
        </a>
      ) : (
        <div
          title="Sin respues desde la última respuesta"
          className="bg-surface-high w-10 text-gray-300 dark:text-gray-600 text-xs font-medium flex items-center justify-center"
        >
          /
        </div>
      )}
    </div>
  );
};

const Threads = {
  Root,
  Thread,
};

export default Threads;
