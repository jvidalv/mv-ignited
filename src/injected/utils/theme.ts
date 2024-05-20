export const injectTheme = () => {
  const isLotr = document.querySelector('link[href$="/lotr.css"]');
  const isDark = document.querySelector('link[href$="/dark_v7.css"]');
  const isFire = document.querySelector('link[href$="/fire.css"]');
  const isGhost = document.querySelector('link[href$="/ghost.css"]');
  const isEmpire = document.querySelector('link[href$="/empire.css"]');

  if (isLotr || isDark || isFire || isGhost || isEmpire) {
    const html = document.getElementsByTagName("html").item(0);

    html?.setAttribute("class", "dark");
    html?.setAttribute("prefers-color-scheme", "dark");
  }
};
