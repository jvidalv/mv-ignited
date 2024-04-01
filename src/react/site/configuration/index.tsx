import { mvstore } from "../../../utils/json";
import React, { useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";

export const ConfigurationMenu = () => {
  const ignoredUsers = mvstore.get().ignoredUsers ?? [];
  console.log(ignoredUsers);

  const onUnIgnoreUserClick = (username: string) => {
    if (
      confirm("Estas seguro de que quieres dejar de ignorar a este usuario?")
    ) {
      mvstore.set(
        "ignoredUsers",
        ignoredUsers.filter((i) => i !== username),
      );

      window.ignite
        .render()
        .then(() => console.log("MV-Ignite: un-ignoring user"));
    }
  };

  return (
    <div className="float-right w-1/3 -mt-[2px] min-h-screen bg-surface-high shadow-lg">
      <div className="bg-surface px-4 py-1 shadow">
        <h2>MV-Ignited 🔥</h2>
      </div>
      <div className="mt-2 px-4">
        <div className="grid grid-cols-1 gap-2">
          <label className="font-bold text-base">Usarios ignorados</label>
          <div className="flex flex-wrap gap-2">
            {!ignoredUsers?.length && (
              <div className="opacity-50 -mt-4">
                No tienes ningun usuario ignorado.
              </div>
            )}
            {ignoredUsers?.map((username) => (
              <button
                key={username}
                className="bg-surface shadow rounded hover:bg-opacity-50 px-2"
                onClick={() => onUnIgnoreUserClick(username)}
              >
                {username} ❌
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfigurationButton = ({
  configurationMenuId,
}: {
  configurationMenuId: string;
}) => {
  const menuClosedStyle = "opacity:0; pointer-events: none";
  const onClick = () => {
    const menuElement = document.getElementById(configurationMenuId);

    if (menuElement) {
      if (menuElement.getAttribute("style") === menuClosedStyle) {
        menuElement.setAttribute("style", "");
      } else {
        menuElement.setAttribute("style", menuClosedStyle);
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className="text-[1.35rem] h-full pl-1 text-primary mt-[1px] hover:text-gray-200 transition duration-200  flex items-center justify-center"
      title="MV-ignite configuracion"
    >
      <i className="fa fa-cog"></i>
      <span className="title">Configuración MV-Ignite</span>
    </button>
  );
};
