export const injectBrand = () => {
  // Update title only if not already branded
  if (!window.document.title.endsWith("🔥")) {
    window.document.title = `${window.document.title}🔥`;
  }
};
