export const injectTheme = () => {
  const isLotr = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/lotr.css"]',
  );
  const isDark = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/dark_v7.css"]',
  );
  const isFire = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/fire.css"]',
  );
  const isGhost = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/ghost.css"]',
  );
  const isEmpire = document.querySelector(
    'link[href="https://mediavida.b-cdn.net/style/429/empire.css"]',
  );

  if (isLotr || isDark || isFire || isGhost || isEmpire) {
    const html = document.getElementsByTagName("html").item(0);

    html?.setAttribute("class", "dark");
    html?.setAttribute("prefers-color-scheme", "dark");
  }
};
