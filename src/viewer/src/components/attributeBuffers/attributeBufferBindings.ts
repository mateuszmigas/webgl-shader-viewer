import { AttributeBufferType } from "./../../utils/webgl/attributeBuffer";

export const attributeBufferBindings = new Map<
  AttributeBufferType,
  { [key: string]: { display: string; value: any } }
>([
  [
    AttributeBufferType.FLOAT_VEC2,
    {
      bindingab: { display: "binding ab1", value: [1, 2, 3] },
    },
  ],
]);

export const bindingNames = new Set<string>(
  Array.from(attributeBufferBindings.values()).flatMap(Object.keys)
);

export const getBindingValue = (name: string, type: AttributeBufferType) =>
  attributeBufferBindings.get(type)[name].value;

export const getBindingOptions = (type: AttributeBufferType) => {
  const bindings = attributeBufferBindings.get(type);
  return bindings
    ? Object.entries(bindings).map(([key, value]) => ({
        id: key,
        display: value.display,
      }))
    : [];
};
