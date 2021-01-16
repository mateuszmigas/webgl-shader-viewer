import {
  createVector2,
  createVector3,
  createVector4,
  Vector2,
  Vector3,
  Vector4,
} from "../../components/inputNumber";
import {
  createDropdown,
  createElementsDropdown,
} from "../../components/dropdown";
import { createColor3, createColor4 } from "../../components/inputColor";
import { UniformInfo, UniformType } from "./uniform";
import { CompositeKeyMap } from "../compositeKeyMap";
import { createDiv, withLabel } from "../../components/wrappers";
import { uuidv4 } from "../../../../common/uuid";

const uniformComponentCache = new CompositeKeyMap<
  { name: string; type: UniformType },
  { component: HTMLElement; uniformInfo: UniformInfo }
>(key => `${key.name};${key.type}`);

export const createUniformComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  uniforms: { name: string; type: UniformType }[]
) => {
  const uniformComponents = uniforms.map(uniform => {
    const key = {
      ...uniform,
    };

    const fromCache = uniformComponentCache.get(key);

    if (fromCache) {
      fromCache.uniformInfo.attachToProgram(program);
      return { key, value: fromCache };
    } else {
      const uniformInfo = new UniformInfo(
        context,
        program,
        uniform.name,
        uniform.type
      );
      const component = withLabel(
        createUniformComponent(uniformInfo),
        uniform.name
      );
      return { key, value: { component, uniformInfo } };
    }
  });

  uniformComponentCache.clear();
  uniformComponents.forEach(uc => uniformComponentCache.set(uc.key, uc.value));

  return uniformComponents.map(uc => uc.value);
};

const createUniformComponent = (uniformInfo: UniformInfo) => {
  switch (uniformInfo.getUniformType()) {
    case UniformType.FLOAT_VEC2:
      return createUniformForVec2(value => uniformInfo.setValue(value));
    case UniformType.FLOAT_VEC3:
      return createUniformForVec3(value => uniformInfo.setValue(value));
    case UniformType.FLOAT_VEC4:
      const initialValue: Vector4 = [1, 0, 0, 1];
      uniformInfo.setValue(initialValue);
      return createUniformForVec4(initialValue, value =>
        uniformInfo.setValue(value)
      );
    case UniformType.SAMPLER_2D:
      return createUniformForTexture(value => {
        const currentsetValue = uuidv4();
        //load with debounce => then
        uniformInfo.setValue({ slot: value.slot, textureData: true });
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

  const optionsElement = createElementsDropdown([
    {
      id: "custom",
      display: "Custom",
      element: customElement,
    },
    {
      id: "color",
      display: "Color",
      element: colorElement,
    },
  ]);

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

  const optionsElement = createElementsDropdown([
    { id: "custom", display: "Custom", element: customElement },
    { id: "color", display: "Color", element: colorElement },
  ]);

  return createDiv("column-with-gap", [
    optionsElement,
    customElement,
    colorElement,
  ]);
};
