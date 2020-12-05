export const createTextArea = (): {
  element: HTMLTextAreaElement;
  controller: {
    setText: (text: string) => void;
    getText: () => string;
  };
} => {
  const element = document.createElement("textarea");
  const getText = () => element.value;
  const setText = (text: string) => (element.value = text);

  return {
    element,
    controller: {
      getText,
      setText,
    },
  };
};
