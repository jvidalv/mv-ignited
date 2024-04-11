import React from "react";
import { useStore } from "../../../utils/store";
import { Tooltip } from "../components/ui";

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
    <div className="text-left mt-2 opacity-30 hover:opacity-100 transition duration-200">
      <Tooltip content={isIgnored ? "Designorar usuario" : "Ignorar usuario"}>
        <button
          className="transition duration-100 rounded text-center"
          onClick={onIgnoreUserClick}
        >
          <i
            className={
              isIgnored ? "fa fa-microphone" : "fa fa-microphone-slash"
            }
          ></i>
        </button>
      </Tooltip>
    </div>
  );
};
