// import WebFont from "webfontloader";
// import { awaitUntil } from "../injected/utils/promises";

const FONT_STYLESHEET_ID = "mv-ignited--font";

// function capitalizeFirstLetter(string: string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// export const loadFont = async (customFont: string) => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loadFont = async (_customFont: string) => {
  return alert("Coming soon!");
  // WebFont.load({
  //   google: {
  //     families: [capitalizeFirstLetter(customFont)],
  //   },
  // });

  // await awaitUntil(
  //   () => !!document.getElementsByClassName("wf-active").item(0),
  // );
  // const head = document.head;
  // let styles = document.getElementById(FONT_STYLESHEET_ID);
  // if (!styles) {
  //   styles = document.createElement("style");
  //   styles.id = FONT_STYLESHEET_ID;
  // }
  // styles.innerHTML = `*:not(i) { font-family: '${customFont}' !important}`;
  // head.appendChild(styles);
};

export const removeFont = () => {
  const styles = document.getElementById(FONT_STYLESHEET_ID);
  styles?.remove();
};
