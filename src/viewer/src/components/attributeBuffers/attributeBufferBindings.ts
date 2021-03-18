import { meshes, MeshInfo } from "./../../meshes";
import { AttributeBufferType } from "./../../utils/webgl/attributeBuffer";

const getMeshBinding = (meshId: string, name: keyof MeshInfo) =>
  JSON.stringify((meshes.get(meshId) as any)[name]);

export const attributeBufferBindings = new Map<
  string,
  { display: string; type: AttributeBufferType; getValue: (id: string) => any }
>([
  [
    "positions",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: "Binding - Mesh positions",
      getValue: id => getMeshBinding(id, "positions"),
    },
  ],
  [
    "textureCoordinates",
    {
      type: AttributeBufferType.FLOAT_VEC2,
      display: "Binding - Mesh texture coords",
      getValue: id => getMeshBinding(id, "textureCoordinates"),
    },
  ],
  [
    "colors",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: "Binding - Mesh colors",
      getValue: id => getMeshBinding(id, "colors"),
    },
  ],
]);

export const getBindingOptions = (type: AttributeBufferType) =>
  Array.from(attributeBufferBindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));
