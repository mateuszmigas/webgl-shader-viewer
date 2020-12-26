import { createDiv } from "./common";
import { createMultiNumberInput } from "./editVector3";

const colorInputProps = {
  min: "0",
  max: "1",
  step: "0.1",
};

export type Color4 = [number, number, number, number];
export const createColor4 = (
  onChange?: (newValue: Color4) => void
): [
  HTMLDivElement,
  {
    setValues: (value: Color4) => void;
    setReadonly: (readonly: boolean) => void;
    getValues: () => Color4;
  }
] => {
  const initialValue = [0.5, 0.5, 0.5, 1] as Color4;
  const colorDiv = document.createElement("div");
  colorDiv.className = "edit-input-color";
  const setColor = (color: Color4) => {
    colorDiv.style.background = `rgb(${color[0] * 255},${color[1] * 255},${
      color[2] * 255
    },${color[3]})`;
  };

  setColor(initialValue);

  const onChangeInternal = (color: Color4) => {
    setColor(color);
    onChange?.(color);
  };
  const container = createDiv("row-with-gap");
  const [element, controller] = createMultiNumberInput<Color4>(
    initialValue,
    onChangeInternal,
    1,
    4,
    colorInputProps
  );
  container.appendChild(element);
  container.appendChild(colorDiv);
  return [container, controller];
};

export type Color3 = [number, number, number];
export const createColor3 = (
  onChange?: (newValue: Color3) => void
): [
  HTMLDivElement,
  {
    setValues: (value: Color3) => void;
    setReadonly: (readonly: boolean) => void;
    getValues: () => Color3;
  }
] => {
  const initialValue = [0.5, 0.5, 0.5] as Color3;
  const colorDiv = document.createElement("div");
  colorDiv.className = "edit-input-color";
  const setColor = (color: Color3) => {
    colorDiv.style.background = `rgb(${color[0] * 255},${color[1] * 255},${
      color[2] * 255
    },1)`;
  };

  setColor(initialValue);

  const onChangeInternal = (color: Color3) => {
    setColor(color);
    onChange?.(color);
  };
  const container = createDiv("row-with-gap");
  const [element, controller] = createMultiNumberInput<Color3>(
    initialValue,
    onChangeInternal,
    1,
    4,
    colorInputProps
  );
  container.appendChild(element);
  container.appendChild(colorDiv);
  return [container, controller];
};
