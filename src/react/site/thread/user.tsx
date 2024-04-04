import React from "react";
import { useStore } from "../../../utils/store";

export const UserActionsInThread = ({ username }: { username: string }) => {
  const { usersIgnored, update } = useStore();
  const isIgnored = usersIgnored.includes(username);
  const onIgnoreUserClick = () => {
    if (isIgnored) {
      update("usersIgnored", [
        ...new Set([...usersIgnored.filter((u) => u !== username)]),
      ]);
    } else {
      update("usersIgnored", [...new Set([...usersIgnored, username])]);
    }
  };

  return (
    <div className="text-left mt-2 opacity-75 hover:opacity-100 transition duration-200">
      <button
        title={isIgnored ? "Designorar usuario" : "Ignorar usuario"}
        className="bg-surface-high border dark:border-gray-700 hover:bg-opacity-75 transition duration-100 rounded px-1.5 py-0.5 text-center shadow"
        onClick={onIgnoreUserClick}
      >
        <i
          className={isIgnored ? "fa fa-microphone" : "fa fa-microphone-slash"}
        ></i>
      </button>
    </div>
  );
};

export const UserIgnoredInThread = ({
  onView,
  username,
}: {
  username: string;
  onView: () => void;
}) => {
  return (
    <div className="w-full h-5 flex opacity-25 hover:opacity-100 transition duration-200 items-center justify-center gap-1">
      <div className="opacity-50">
        Ignorado, <strong>{username}</strong> :
      </div>
      <button
        onClick={onView}
        className="opacity-50 hover:opacity-100 hover:underline"
      >
        Ver post
      </button>
    </div>
  );
};
