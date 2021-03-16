import { UniformType } from "../../utils/webgl/uniform";

export const uniformBindings = new Map<
  UniformType,
  { [key: string]: { display: string; value: any } }
>([
  [
    UniformType.FLOAT_VEC2,
    {
      binding1: { display: "binding 1", value: [1, 2, 3] },
      binding2: { display: "binding 22", value: [1444, 2, 3] },
    },
  ],
]);

export const bindingNames = new Set<string>(
  Array.from(uniformBindings.values()).flatMap(Object.keys)
);

export const getBindingValue = (name: string, type: UniformType) =>
  uniformBindings.get(type)[name].value;

export const getBindingOptions = (type: UniformType) => {
  const bindings = uniformBindings.get(type);
  return bindings
    ? Object.entries(bindings).map(([key, value]) => ({
        id: key,
        display: value.display,
      }))
    : [];
};
