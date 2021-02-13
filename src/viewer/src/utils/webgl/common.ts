export const createElementNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported uniform";
  return div;
};
