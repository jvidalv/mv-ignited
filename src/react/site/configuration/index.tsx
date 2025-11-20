import { Feature, useStore } from "../../../utils/store";
import React, { useRef } from "react";
import { Tooltip } from "../components/ui";
import {
  isValidCSSSize,
  MVIgnitedCustomTheme,
  useCustomTheme,
} from "../../../utils/custom-theme";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";

const getFeatureName = (feature: Feature) => {
  switch (feature) {
    case Feature.NewHomepage:
      return "Homepage rediseñada";
    case Feature.NoAvatars:
      return "Sin avatares";
    case Feature.NoLogo:
      return "Sin logo";
    case Feature.Monospace:
      return "Fuente mono";
    case Feature.BlackAndWhite:
      return "Modo blanco/negro";
    case Feature.ImprovedUpvotes:
      return "Manitas mejoradas";
    case Feature.NoSideMenu:
      return "Quitar menu lateral en hilos";
    case Feature.ImagesInSpoiler:
      return "Imagenes en spoiler";
    case Feature.YoutubeInSpoiler:
      return "Youtube en spoiler";
    case Feature.TwitterInSpoiler:
      return "Twitter en spoiler";
    case Feature.RandomMediaInSpoiler:
      return "Otra media en spoiler (Reddit, Instagram...)";
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
  const ref = useRef<HTMLDivElement>(null);
  const { threadsIgnored, users, update, features } = useStore();
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

    window.ignited
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

  const handleClickOutside = (event: MouseEvent | TouchEvent | FocusEvent) => {
    const target = event.target as HTMLElement;
    // Quick hack to not trigger it on menu open click
    if (target.getAttribute("class") === "fa fa-cog") {
      return;
    } else {
      close();
    }
  };

  useOnClickOutside(ref as React.RefObject<HTMLElement>, handleClickOutside);

  return (
    <div
      id={id}
      ref={ref}
      className="float-right w-1/3 max-w-[420px] border-l border-solid border-l-transparent min-h-screen bg-surface-high shadow-lg"
    >
      <div className="bg-surface flex justify-between items-center px-4 py-2 shadow">
        <h2 className="font-black">MV-Ignited 🔥</h2>
        <a href="/ignited" className="hover:underline text-base">
          Página de Ignited ➡️
        </a>
      </div>
      <div className="mt-2 px-4">
        <div className="grid grid-cols-1">
          <label className="font-bold text-base">Features</label>
          <div className="grid gap-2 mt-2">
            {Object.values(Feature).map((f) => (
              <label
                key={f}
                htmlFor={f}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={f}
                  checked={features.includes(f)}
                  onChange={() =>
                    update(
                      "features",
                      features.includes(f)
                        ? features.filter((fe) => fe !== f)
                        : [...features, f],
                    )
                  }
                  className="sr-only peer"
                />
                <div className="checkbox relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {getFeatureName(f)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 mt-4">
          <label className="font-bold text-base">
            Customizar colores y ancho
          </label>
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
                    className="px-1 py-2 rounded h-5 w-full text-gray-500"
                    placeholder="Ejemplo: 1300px"
                    onChange={(e) => {
                      if (!e.target.value || isValidCSSSize(e.target.value)) {
                        updateCustomTheme(
                          "customWidth",
                          e.target.value || undefined,
                        );
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
              <Tooltip key={thread} content="Click para eliminar">
                <button
                  className=" whitespace-nowrap bg-surface shadow rounded hover:bg-opacity-50 overflow-ellipsis line-clamp-1 px-2"
                  onClick={() => onUnIgnoreThreadClick(thread)}
                >
                  <i className="fa fa-trash"></i> {thread.split("/")[3]}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const latestUpdate = "5";

export const ConfigurationButton = ({ toggle }: { toggle: () => void }) => {
  const latestUpdateViewed = useStore((s) => s.latestUpdateViewed);
  const update = useStore((s) => s.update);

  const onClick = () => {
    toggle();
    setTimeout(() => update("latestUpdateViewed", latestUpdate), 1500);
  };

  return (
    <>
      <a
        onClick={onClick}
        className="hl cursor-pointer text-[1.35rem] h-full pl-1 text-[rgba(255,255,255,.5)] mt-[1px] hover:text-gray-200 transition duration-200  flex items-center justify-center"
        title="MV-ignite configuracion"
      >
        <i className="fa fa-cog"></i>
        <span className="title">Configuración MV-Ignited</span>
        {latestUpdateViewed !== latestUpdate && (
          <span className="bubble">New</span>
        )}
      </a>
    </>
  );
};
