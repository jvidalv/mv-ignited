import { useStore } from "../../../utils/store";
import React, { useState } from "react";
import { loadFont, removeFont } from "../../../utils/fonts";
import { Button } from "../components/ui";

export const ConfigurationMenu = () => {
  const [inputCustomFont, setInputCustomFont] = useState<string>();
  const { threadsIgnored, users, customFont, update } = useStore();

  const onUnIgnoreUserClick = (username: string) => {
    update(
      "users",
      users.map((u) => {
        if (u.username === username) {
          return {
            ...u,
            isIgnored: false,
          };
        }

        return u;
      }),
    );

    window.ignite
      .render()
      .then(() => console.log("MV-Ignited: un-ignoring user"));
  };

  const onUnIgnoreThreadClick = (thread: string) => {
    update(
      "threadsIgnored",
      threadsIgnored.filter((i) => i !== thread),
    );
    console.log("MV-Ignited: un-ignoring thread");
  };

  const onSelectFont = async () => {
    if (!inputCustomFont) {
      return alert("No es una font valida de Google Fonts!");
    }

    await loadFont(inputCustomFont);
    update("customFont", inputCustomFont);
  };

  const onRemoveFont = () => {
    update("customFont", undefined);
    removeFont();
  };

  return (
    <div className="float-right w-1/3 max-w-[420px] -mt-[0px] min-h-screen bg-surface-high shadow-lg">
      <div className="bg-surface flex justify-between items-center px-4 py-2 shadow">
        <h2 className="font-black">MV-Ignited 🔥</h2>
        <a href="/ignited" className="hover:underline">
          Main Page ➡️
        </a>
      </div>
      <div className="mt-2 px-4">
        <div className="grid grid-cols-1 gap-2 hidden">
          <label className="font-bold text-base">Custom font</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="px-2 h-full col-span-2 text-black rounded disabled:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Google font"
              defaultValue={customFont ?? ""}
              disabled={!!customFont}
              onChange={(e) => setInputCustomFont(e.target.value)}
            />
            {customFont ? (
              <Button onClick={onRemoveFont}>Remove font</Button>
            ) : (
              <Button onClick={onSelectFont}>Inject font</Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-4">
          <label className="font-bold text-base">Usarios ignorados</label>
          <div className="flex flex-wrap gap-1">
            {!users.some((u) => u.isIgnored) && (
              <div className="opacity-50 -mt-4">
                No tienes ningún usuario ignorado.
              </div>
            )}
            {users
              ?.filter((u) => u.isIgnored)
              .map((u) => (
                <button
                  key={u.username}
                  className="bg-surface shadow rounded hover:bg-opacity-50 px-2"
                  onClick={() => onUnIgnoreUserClick(u.username)}
                >
                  {u.username} <i className="fa fa-trash"></i>
                </button>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-4">
          <label className="font-bold text-base">Hilos ignorados</label>
          <div className="grid grid-cols-1 gap-1">
            {!threadsIgnored?.length && (
              <div className="opacity-50 -mt-4">
                No tienes ningún hilo ignorado.
              </div>
            )}
            {threadsIgnored?.map((thread) => (
              <button
                key={thread}
                className="text-left whitespace-nowrap bg-surface shadow rounded hover:bg-opacity-50 overflow-ellipsis line-clamp-1 px-2"
                onClick={() => onUnIgnoreThreadClick(thread)}
              >
                {thread.split("/")[3]} <i className="fa fa-trash"></i>
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
      className="text-[1.35rem] h-full pl-1 text-[rgba(255,255,255,.5)] mt-[1px] hover:text-gray-200 transition duration-200  flex items-center justify-center"
      title="MV-ignite configuracion"
    >
      <i className="fa fa-cog"></i>
      <span className="title">Configuración MV-Ignited</span>
    </button>
  );
};
