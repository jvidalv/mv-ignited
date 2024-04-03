import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => {
  return (
    <button
      className="bg-primary whitespace-nowrap hover:bg-opacity-50 text-white font-bold px-4 rounded"
      {...props}
    />
  );
};
