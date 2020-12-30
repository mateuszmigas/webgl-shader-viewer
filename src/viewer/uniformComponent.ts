import {
  createVector2,
  createVector3,
  createVector4,
  Vector2,
  Vector3,
  Vector4,
} from "./components/editVector3";
import { createDiv } from "./components/common";
import { createDropdown } from "./components/dropdown";
import { createColor3, createColor4 } from "./components/editColor";
import { UniformInfo, UniformType } from "./uniform";

export const createUniformComponent = (
  uniformInfo: UniformInfo,
  render: () => void
) => {
  switch (uniformInfo.type) {
    case UniformType.FLOAT_VEC2:
      return createUniformForVec2((value) => {
        uniformInfo.update(value);
        render();
      });
    case UniformType.FLOAT_VEC3:
      return createUniformForVec3((value) => {
        uniformInfo.update(value);
        render();
      });
    case UniformType.FLOAT_VEC4:
      return createUniformForVec4((value) => {
        uniformInfo.update(value);
        render();
      });
    default:
      return createUniformNotSupported();
  }
};

export const createUniformNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported uniform";
  return div;
};

export const createUniformSelection = (elements: {
  [key: string]: { display: string; element: HTMLElement };
}) => {
  const [optionsElement, optionsController] = createDropdown(
    (item) => {
      if (!item) return;

      Object.values(elements).forEach((oe) =>
        oe.element.classList.add("hidden")
      );

      elements[item.id].element.classList.remove("hidden");
    },
    "",
    { emptyItem: false }
  );
  optionsController.setItems(
    Object.entries(elements).map(([key, value]) => ({
      id: key,
      display: value.display,
    }))
  );
  optionsController.setSelectedItemById("custom");
  return optionsElement;
};

export const createUniformForVec2 = (update: (value: Vector2) => void) => {
  const [customElement, customController] = createVector2(update);
  customController.setValues([0, 0]);
  return customElement;
};

export const createUniformForVec3 = (update: (value: Vector3) => void) => {
  const [customElement, customController] = createVector3(update);
  customController.setValues([0, 0, 0]);

  const [colorElement, colorController] = createColor3(update);
  colorController.setValues([1, 0, 0]);

  const optionsElement = createUniformSelection({
    custom: {
      display: "Custom",
      element: customElement,
    },
    color: {
      display: "Color",
      element: colorElement,
    },
  });

  return createDiv("column-with-gap", [
    optionsElement,
    customElement,
    colorElement,
  ]);
};

export const createUniformForVec4 = (update: (value: Vector4) => void) => {
  const [customElement, customController] = createVector4(update);
  customController.setValues([0, 0, 0, 0]);

  const [colorElement, colorController] = createColor4(update);
  colorController.setValues([1, 0, 0, 1]);

  const optionsElement = createUniformSelection({
    custom: {
      display: "Custom",
      element: customElement,
    },
    color: {
      display: "Color",
      element: colorElement,
    },
  });

  return createDiv("column-with-gap", [
    optionsElement,
    customElement,
    colorElement,
  ]);
};
