export const injectBrand = () => {
  const logo = document.getElementById("logo");
  if (logo) {
    logo.setAttribute("style", "position: relative;");
    logo.innerHTML = `${logo.innerHTML}<span style="position:absolute; font-size:20px; right: -16px;">🔥</span>`;
  }

  window.document.title = `${window.document.title}🔥`;
};
