import { repeat } from "@utils/array";
import { assertNever } from "@utils/typeGuards";
import { customOption } from "@common/constants";
import { translations } from "@common/translations";
import { getCameraMatrix } from "@utils/cameraManipulator";
import { UniformType } from "@utils/webgl/uniform/uniform";

const bindings = new Map<
  string,
  { display: string; type: UniformType; getValue: (...arg: any[]) => any }
>([
  [
    "perspectiveCamera",
    {
      type: UniformType.FLOAT_MAT4,
      display: translations.bindings.uniformPerspectiveCamera,
      getValue: (cameraPosition, size) => getCameraMatrix(cameraPosition, size),
    },
  ],
]);

const getDefaultOption = (name: string) => {
  const lowerCaseName = name.toLocaleLowerCase();
  if (lowerCaseName.includes("camera")) {
    return "perspectiveCamera";
  }
  return customOption.id;
};

const getDefaultValue = (type: UniformType) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return repeat(2, 1);
    case UniformType.FLOAT_VEC3:
      return repeat(3, 1);
    case UniformType.FLOAT_VEC4:
      return repeat(4, 1);
    case UniformType.FLOAT_MAT4:
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    default:
      assertNever(type);
  }
};

export const getUniformBinding = (name: string) => bindings.get(name);

export const getUniformBindingOptionsForType = (type: UniformType) =>
  Array.from(bindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));

export const getDefaultUniformState = (name: string, type: UniformType) => ({
  optionId: getDefaultOption(name),
  value: getDefaultValue(type),
});