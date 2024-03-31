import { useEffect, useState } from "react";

const useTab = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  useEffect(() => {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      setTab(tab);
    })();
  }, []);

  return tab;
};

export default useTab;
