import { Feature, useStore } from "../../../utils/store";
import React, { useEffect, useState } from "react";
import { loadFont, removeFont } from "../../../utils/fonts";
import { Button, Tooltip } from "../components/ui";
import {
  isValidCSSSize,
  MVIgnitedCustomTheme,
  useCustomTheme,
} from "../../../utils/custom-theme";
import clsx from "clsx";
import { hasParentWithId } from "../../../utils/dom";

const getFeatureName = (feature: Feature) => {
  switch (feature) {
    case Feature.NewHomepage:
      return "Homepage rediseñada";
  }
};

const getCustomThemePropName = (property: keyof MVIgnitedCustomTheme) => {
  switch (property) {
    case "customWidth":
      return "Ancho del contenido";
    case "primaryColour":
      return "Color primario";
    case "headerColour":
      return "Header";
    case "pageBackground":
      return "Fondo";
  }
};

const id = "mv-ignited--inner-configuration--container";

export const ConfigurationMenu = ({ close }: { close: () => void }) => {
  const [inputCustomFont, setInputCustomFont] = useState<string>();
  const { threadsIgnored, users, customFont, update, features } = useStore();
  const { update: updateCustomTheme, ...customTheme } = useCustomTheme();

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

  // This is to close the menu on outside click, is hacky rushed as heck, please improve
  useEffect(() => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      // Quick hack to not trigger it on menu open click
      if (target.getAttribute("class") === "fa fa-cog") {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (!hasParentWithId(e.target, id)) {
        return close();
      }
    });
  }, []);

  return (
    <div
      id={id}
      className="float-right w-1/3 max-w-[420px] min-h-screen bg-surface-high shadow-lg -mt-[1px]"
    >
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
        <div className="grid grid-cols-1">
          <label className="font-bold text-base">Features</label>
          <div>
            {Object.values(Feature).map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span>{getFeatureName(f)}</span>
                <input
                  type="checkbox"
                  checked={features.includes(f)}
                  onChange={() =>
                    update(
                      "features",
                      features.includes(f)
                        ? features.filter((f) => f !== f)
                        : [...features, f],
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label className="font-bold text-base">Custom theme</label>
          <div>
            <div className="flex items-center gap-2 h-8">
              <span className="flex-1">
                {getCustomThemePropName("customWidth")}
              </span>
              <div className="flex gap-1">
                <Tooltip content="Solo funciona si es CSS valido y mayor de 800 y menor del tamaño disponible de pantalla">
                  <input
                    type="text"
                    defaultValue={customTheme.customWidth ?? ""}
                    className="p-1 rounded h-5 w-full"
                    placeholder="Ejemplo: 1300px"
                    onChange={(e) => {
                      if (!e.target.value || isValidCSSSize(e.target.value)) {
                        updateCustomTheme("customWidth", e.target.value);
                      }
                    }}
                  />
                </Tooltip>
              </div>
            </div>

            {Object.keys(customTheme)
              .filter((k) => k !== "customWidth")
              .map((key) => (
                <div key={key} className="flex items-center gap-2 h-8">
                  <span className="flex-1">
                    {getCustomThemePropName(key as keyof MVIgnitedCustomTheme)}
                  </span>
                  <div className="flex gap-1">
                    <input
                      type={key === "customWidth" ? "text" : "color"}
                      value={
                        customTheme[key as keyof MVIgnitedCustomTheme] ?? ""
                      }
                      className={clsx(
                        key === "customWidth" && "p-1 rounded h-5 w-full",
                      )}
                      placeholder={
                        key === "customWidth" ? "Ejemplo: 1300px" : "color"
                      }
                      onChange={(e) =>
                        updateCustomTheme(
                          key as keyof MVIgnitedCustomTheme,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() =>
                      updateCustomTheme(
                        key as keyof MVIgnitedCustomTheme,
                        undefined,
                      )
                    }
                  >
                    🗑️
                  </button>
                </div>
              ))}
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

export const ConfigurationButton = ({ toggle }: { toggle: () => void }) => {
  return (
    <button
      onClick={toggle}
      className="text-[1.35rem] h-full pl-1 text-[rgba(255,255,255,.5)] mt-[1px] hover:text-gray-200 transition duration-200  flex items-center justify-center"
      title="MV-ignite configuracion"
    >
      <i className="fa fa-cog"></i>
      <span className="title">Configuración MV-Ignited</span>
    </button>
  );
};
