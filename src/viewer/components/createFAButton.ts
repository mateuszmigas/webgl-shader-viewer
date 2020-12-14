export const createFAButton = (
  text: string,
  className: string,
  onClick: () => void
) => {
  const button = document.createElement("button");
  button.onclick = onClick;
  button.className = className;
  button.textContent = text;
  return { element: button };
};
