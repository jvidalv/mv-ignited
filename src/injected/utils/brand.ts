export const injectBrand = () => {
  // Batch DOM updates to reduce reflows
  const logo = document.getElementById("logo");
  if (logo && !logo.querySelector(".mv-ignited-brand")) {
    // Use a span element instead of innerHTML to avoid reflow
    const fireEmoji = document.createElement("span");
    fireEmoji.className = "mv-ignited-brand";
    fireEmoji.style.cssText =
      "position:absolute; font-size:20px; right: -16px;";
    fireEmoji.textContent = "🔥";

    // Batch style and DOM changes
    logo.style.position = "relative";
    logo.appendChild(fireEmoji);
  }

  // Update title only if not already branded
  if (!window.document.title.endsWith("🔥")) {
    window.document.title = `${window.document.title}🔥`;
  }
};
