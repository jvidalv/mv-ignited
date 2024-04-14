export const injectUser = () => {
  // Customization button
  const username = window.location.href.split("/")[4];
  const mvIgnitedButton = document.createElement("a");
  mvIgnitedButton.innerHTML = `<a class="btn" style="border-color: orange" href="https://www.mediavida.com/ignited?q=${username}"><i class="fa fa-edit"></i><span class="ddi"> Customizar🔥</span></a>`;
  document.querySelector(".hero-controls")?.append(mvIgnitedButton);
};
