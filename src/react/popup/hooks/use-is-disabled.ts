import useTab from "./use-tab";

const useIsDisabled = () => {
  const tab = useTab();

  return (
    !tab || !tab?.url || !tab?.url?.startsWith("https://www.mediavida.com/")
  );
};

export default useIsDisabled;
