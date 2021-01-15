export const withLabel = (
  element: HTMLElement,
  text: string,
  className?: string
) => {
  const wrapper = document.createElement("div");
  wrapper.className = `${className ?? ""} options-wrapper`;
  const label = document.createElement("label");
  label.className = "options-label";
  label.textContent = text;
  element.className = `${element.className} options-content`;
  wrapper.appendChild(label);
  wrapper.appendChild(element);
  return wrapper;
};

export const createDiv = (className: string, children?: HTMLElement[]) => {
  const div = document.createElement("div");
  div.className = className;
  children?.forEach(c => div.appendChild(c));
  return div;
};
