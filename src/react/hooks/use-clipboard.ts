import { useState } from "react";
import toast from "react-hot-toast";

const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copiada!");
      })
      .catch(() => {
        toast.error("Error copiando!");
      });
  };

  return { copied, copyToClipboard };
};

export default useClipboard;
