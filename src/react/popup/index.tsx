import React from "react";
import useIsDisabled from "./hooks/use-is-disabled";
import clsx from "clsx";

function Popup() {
  const isDisabled = useIsDisabled();

  return (
    <div
      className={clsx(
        "bg-gray-100 min-w-64",
        isDisabled && "pointer-events-none opacity-25",
      )}
    >
      <header className="border-b shadow bg-primary px-4 py-2">
        <div className="relative h-4 flex items-center justify-center w-full">
          <div className="absolute top-[0.1px] rounded bg-black shadow-lg p-1">
            <img src="/assets/logo.png" className="text-white w-6" alt="logo" />
          </div>
        </div>
      </header>
      <main className="p-4 space-y-4">
        <div className="mt-1">Se vienen cositas pronto!</div>
      </main>
    </div>
  );
}

export default Popup;
