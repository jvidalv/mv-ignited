import { mvstore } from "../../../utils/json";
import React from "react";

export const Configuration = ({ rerender }: { rerender: () => void }) => {
  const ignoredUsers = mvstore.get().ignoredUsers ?? [];

  const onUnIgnoreUserClick = (username: string) => {
    confirm("Estas seguro de que quieres dejar de ignorar a este usuario?");
    {
      mvstore.set(
        "ignoredUsers",
        ignoredUsers.filter((i) => i !== username),
      );

      rerender();
    }
  };

  return (
    <div className="mt-6 bg-surface-high p-4 rounded shadow w-full">
      <h1>MV Ignited 🔥</h1>
      <div className="grid grid-cols-1 gap-2 mt-4">
        <label>Usarios ignorados</label>
        <div className="flex gap-2">
          {!ignoredUsers?.length && (
            <div className="opacity-50">No tienes ningun usuario ignorado.</div>
          )}
          {ignoredUsers?.map((username) => (
            <button
              key={username}
              className="bg-surface shadow hover:bg-opacity-75 p-2"
              onClick={() => onUnIgnoreUserClick(username)}
            >
              {username} ❌
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
