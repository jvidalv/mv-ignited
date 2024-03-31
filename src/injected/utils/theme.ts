export const injectTheme = () => {
  const isLotr = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/lotr.css"]',
  );
  const isDark = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/dark_v7.css"]',
  );

  if (isLotr || isDark) {
    const html = document.getElementsByTagName("html").item(0);

    html?.setAttribute("class", "dark");
    html?.setAttribute("prefers-color-scheme", "dark");
  }
};
