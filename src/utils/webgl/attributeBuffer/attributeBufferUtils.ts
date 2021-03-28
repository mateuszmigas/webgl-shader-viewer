import { customOption } from "@common/constants";
import { translations } from "@common/translations";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";
import { meshes, MeshInfo } from "viewer/meshes";

const getMeshBinding = (meshId: string, name: keyof MeshInfo) =>
  JSON.stringify(meshes.get(meshId)[name]);

const bindings = new Map<
  string,
  { display: string; type: AttributeBufferType; getValue: (id: string) => any }
>([
  [
    "positions",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: translations.bindings.meshPositions,
      getValue: id => getMeshBinding(id, "positions"),
    },
  ],
  [
    "textureCoordinates",
    {
      type: AttributeBufferType.FLOAT_VEC2,
      display: translations.bindings.meshTextureCoordinates,
      getValue: id => getMeshBinding(id, "textureCoordinates"),
    },
  ],
  [
    "colors",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: translations.bindings.meshColors,
      getValue: id => getMeshBinding(id, "colors"),
    },
  ],
]);

const getDefaultOption = (name: string) => {
  const lowerCaseName = name.toLocaleLowerCase();
  if (lowerCaseName.includes("posit")) {
    return "positions";
  }
  if (lowerCaseName.includes("coord")) {
    return "textureCoordinates";
  }
  if (lowerCaseName.includes("colors")) {
    return "colors";
  }
  return customOption.id;
};

export const getAttributeBufferBinding = (name: string) => bindings.get(name);

export const getAttributeBufferBindingOptionsForType = (type: AttributeBufferType) =>
  Array.from(bindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));

export const getDefaultAttributeBufferState = (name: string) => ({
  optionId: getDefaultOption(name),
  value: "[]",
  error: "",
});
