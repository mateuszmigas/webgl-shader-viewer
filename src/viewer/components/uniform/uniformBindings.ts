import { translations } from "@common/translations";
import { getCameraMatrix } from "@utils/cameraManipulator";
import { UniformType } from "@utils/webgl/uniform";

export const uniformBindings = new Map<
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

export const getBindingOptions = (type: UniformType) =>
  Array.from(uniformBindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));
