import { mvIgniteStore } from "../../../utils/store";
import React, { useState } from "react";
import { loadFont } from "../../../utils/fonts";
import { Button } from "../components/ui";
import { ignoreThreads } from "../../../domains/thread";
import { rerenderConfigurationMenuRoot } from "../../../injected/configuration";

export const ConfigurationMenu = () => {
  const [customFont, setCustomFont] = useState<string>();

  const store = mvIgniteStore.get();
  const ignoredUsers = store.ignoredUsers ?? [];
  const ignoredThreads = store.ignoredThreads ?? [];

  const onUnIgnoreUserClick = (username: string) => {
    if (
      confirm("Estas seguro de que quieres dejar de ignorar a este usuario?")
    ) {
      mvIgniteStore.set(
        "ignoredUsers",
        ignoredUsers.filter((i) => i !== username),
      );

      window.ignite
        .render()
        .then(() => console.log("MV-Ignited: un-ignoring user"));
    }
  };

  const onUnIgnoreThreadClick = (thread: string) => {
    if (confirm("Estas seguro de que quieres dejar de ignorar este hilo?")) {
      mvIgniteStore.set(
        "ignoredThreads",
        ignoredThreads.filter((i) => i !== thread),
      );
      ignoreThreads();
      rerenderConfigurationMenuRoot();

      console.log("MV-Ignited: un-ignoring thread");
    }
  };

  const onSelectFont = async () => {
    if (!customFont) {
      return alert("No es una font valida de Google Fonts!");
    }

    await loadFont(customFont);
    mvIgniteStore.set("customFont", customFont);
  };

  return (
    <div className="float-right w-1/3 max-w-[420px] -mt-[0px] min-h-screen bg-surface-high shadow-lg">
      <div className="bg-surface h-[46px] px-4 py-1 shadow">
        <h2>MV-Ignited 🔥</h2>
      </div>
      <div className="mt-2 px-4">
        <div className="grid grid-cols-1 gap-2">
          <label className="font-bold text-base">Custom font</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              className="px-2 h-full col-span-2 text-black rounded"
              placeholder="Google font"
              defaultValue={store.customFont ?? ""}
              onChange={(e) => setCustomFont(e.target.value)}
            />
            <Button onClick={onSelectFont}>Inject font</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-4">
          <label className="font-bold text-base">Usarios ignorados</label>
          <div className="flex flex-wrap gap-1">
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
        <div className="grid grid-cols-1 gap-2 mt-4">
          <label className="font-bold text-base">Hilos ignorados</label>
          <div className="grid grid-cols-1 gap-1">
            {!ignoredThreads?.length && (
              <div className="opacity-50 -mt-4">
                No tienes ningun hilo ignorado.
              </div>
            )}
            {ignoredThreads?.map((thread) => (
              <button
                key={thread}
                className="text-left whitespace-nowrap bg-surface shadow rounded hover:bg-opacity-50 overflow-ellipsis line-clamp-1 px-2"
                onClick={() => onUnIgnoreThreadClick(thread)}
              >
                {thread.split("/")[3]} ❌
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
      <span className="title">Configuración MV-Ignited</span>
    </button>
  );
};
