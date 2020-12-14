export const withLabel = (
  element: HTMLElement,
  className: string,
  text: string
) => {
  const wrapper = document.createElement("div");
  wrapper.className = `${className} options-wrapper`;
  const label = document.createElement("label");
  label.className = "options-label";
  label.textContent = text;
  element.className = `${element.className} options-content`;
  wrapper.appendChild(label);
  wrapper.appendChild(element);
  return wrapper;
};
