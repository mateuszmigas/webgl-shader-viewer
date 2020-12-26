export const createDiv = (className: string, children?: HTMLElement[]) => {
  const div = document.createElement("div");
  div.className = className;
  children?.forEach((c) => div.appendChild(c));
  return div;
};
