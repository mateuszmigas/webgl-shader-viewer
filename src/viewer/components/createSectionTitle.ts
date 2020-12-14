export const createSectionTitle = (text: string, className: string) => {
  const element = document.createElement("h3");
  element.textContent = text;
  element.className = `${className} section-title`;
  return { element };
};
