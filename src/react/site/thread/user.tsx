import React from "react";
import { mvstore } from "../../../utils/json";

export const UserOptionsInThread = ({
  username,
  ignoreUsers,
}: {
  ignoreUsers: () => void;
  username: string;
}) => {
  const ignoredUsers = mvstore.get().ignoredUsers ?? [];

  const onIgnoreUserClick = () => {
    if (
      confirm(
        "Esto silenciara al usuario en todos los hilos de mediavida, mas tarde te arrepientes puedes modificarlo desde la configuracion de tu perfil. Continuar?",
      )
    ) {
      ignoredUsers.push(username);
      mvstore.set("ignoredUsers", [...new Set(ignoredUsers)]);
      ignoreUsers();
    }
  };

  return (
    <div className="text-left mt-2 opacity-50 hover:opacity-100 transition duration-200">
      <button
        title="Ignorar usuario"
        className="bg-surface hover:bg-opacity-75 transition duration-100 rounded px-1.5 py-0.5 text-center shadow"
        onClick={onIgnoreUserClick}
      >
        🔇
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
