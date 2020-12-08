export const createSectionTitle = (text: string) => {
  const element = document.createElement("h3");
  element.textContent = text;
  return { element };
};
