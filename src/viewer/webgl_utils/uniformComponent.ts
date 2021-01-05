import { uuidv4 } from "../../utils";
import {
  createVector2,
  createVector3,
  createVector4,
  Vector2,
  Vector3,
  Vector4,
} from "../components/editVector3";
import { createDiv } from "../components/common";
import { createDropdown } from "../components/dropdown";
import { createColor3, createColor4 } from "../components/editColor";
import { UniformInfo, UniformType } from "./uniform";
import { CompositeKeyMap } from "../compositeKeyMap";
import { withLabel } from "../components/wrappers";

const uniformComponentCache = new CompositeKeyMap<
  { name: string; type: UniformType },
  HTMLElement
>((key) => `${key.name};${key.type}`);

export const createUniformComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  render: () => void,
  uniforms: { name: string; type: UniformType }[]
) => {
  const uniformComponents = uniforms.map((u) => {
    const key = {
      ...u,
    };

    const componentFromCache = uniformComponentCache.get(key);

    if (componentFromCache) {
      return { key, component: componentFromCache };
    } else {
      const uniformInfo = new UniformInfo(context, program, u.name, u.type);
      const component = withLabel(
        createUniformComponent(uniformInfo, render),
        "",
        u.name
      );
      uniformComponentCache.set(key, component);
      return { key, component: component };
    }
  });

  uniformComponentCache.clear();
  uniformComponents.forEach((uc) =>
    uniformComponentCache.set(uc.key, uc.component)
  );
  return uniformComponents.map((uc) => uc.component);
};

const createUniformComponent = (
  uniformInfo: UniformInfo,
  render: () => void
) => {
  switch (uniformInfo.getUniformType()) {
    case UniformType.FLOAT_VEC2:
      return createUniformForVec2((value) => {
        uniformInfo.setValue(value);
        render();
      });
    case UniformType.FLOAT_VEC3:
      return createUniformForVec3((value) => {
        uniformInfo.setValue(value);
        render();
      });
    case UniformType.FLOAT_VEC4:
      const initialValue: Vector4 = [1, 0, 0, 1];
      uniformInfo.setValue(initialValue);
      return createUniformForVec4(initialValue, (value) => {
        uniformInfo.setValue(value);
        render();
      });
    case UniformType.SAMPLER_2D:
      return createUniformForTexture((value) => {
        const currentsetValue = uuidv4();
        //load with debounce => then
        uniformInfo.setValue({ slot: value.slot, textureData: true });
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

const createUniformForVec2 = (update: (value: Vector2) => void) => {
  const [customElement, customController] = createVector2(update);
  customController.setValues([0, 0]);
  return customElement;
};

const createUniformForTexture = (
  update: (value: { slot: number; textureSrc: string }) => void
) => {
  const [customElement, customController] = createVector3();
  customController.setValues([0, 0, 0]);
  return customElement;
};

const createUniformForVec3 = (update: (value: Vector3) => void) => {
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

const createUniformForVec4 = (
  initialValue: Vector4,
  update: (value: Vector4) => void
) => {
  const [customElement, customController] = createVector4(update);
  customController.setValues(initialValue);

  const [colorElement, colorController] = createColor4(update);
  colorController.setValues(initialValue);

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
