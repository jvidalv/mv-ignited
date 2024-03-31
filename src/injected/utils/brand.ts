export const injectBrand = () => {
  const logoUrl = "https://imgur.com/vvQHVpd.png";
  const logo = document.getElementById("logo");
  if (logo) {
    logo.id = "logo-mv-ignited";
    logo.setAttribute("style", "float: left;margin-right:-16px");
    logo.innerHTML = `<img alt='logo' src='${logoUrl}' style="height: 29px;margin-top: 6px"></img>`;
  }
};
