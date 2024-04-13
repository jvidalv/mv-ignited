import React, { DetailedHTMLProps, LabelHTMLAttributes } from "react";
import clsx from "clsx";

export const Label = ({
  className,
  ...props
}: DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>) => {
  return (
    <label
      className={clsx(
        className,
        "block text-sm font-medium text-gray-900 dark:text-white",
      )}
      {...props}
    />
  );
};
