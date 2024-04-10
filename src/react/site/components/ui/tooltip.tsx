import React, { ReactElement } from "react";
import Tippy from "@tippyjs/react/headless";

export const Tooltip = ({
  children,
  content,
}: {
  children: ReactElement | undefined;
  content: string;
}) => (
  <Tippy
    render={(attrs) => (
      <div
        className="bg-black text-white py-1 px-2 rounded text-xs"
        tabIndex={-1}
        {...attrs}
      >
        {content}
      </div>
    )}
  >
    {children}
  </Tippy>
);
