import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from "clsx";

export const Button = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={clsx(
        className,
        "bg-primary whitespace-nowrap hover:bg-opacity-50 min-h-[32px] text-white font-medium px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      {...props}
    />
  );
};
