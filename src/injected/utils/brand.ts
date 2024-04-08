// import { useStore } from "../../utils/store";
// import { loadFont } from "../../utils/fonts";

export const injectBrand = () => {
  const logo = document.getElementById("logo");
  if (logo) {
    logo.setAttribute("style", "position: relative;");
    logo.innerHTML = `${logo.innerHTML}<span style="position:absolute; font-size:20px; right: -16px;">🔥</span>`;
  }

  window.document.title = `${window.document.title}🔥`;
};

export const injectFont = async (): Promise<string | void> => {
  // const customFont = useStore.getState()?.customFont;
  //
  // if (customFont) {
  //   await loadFont(customFont);
  //   return customFont;
  // }
};
