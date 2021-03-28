import { customOption } from "@common/constants";
import { translations } from "@common/translations";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer";
import { meshes, MeshInfo } from "viewer/meshes";

const getMeshBinding = (meshId: string, name: keyof MeshInfo) =>
  JSON.stringify(meshes.get(meshId)[name]);

type Key = "positions" | "textureCoordinates" | "colors";
export const attributeBufferBindings = new Map<
  Key,
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

export const getBindingOptions = (type: AttributeBufferType) =>
  Array.from(attributeBufferBindings.entries())
    .filter(([_, value]) => value.type === type)
    .map(([key, value]) => ({
      id: key,
      display: value.display,
    }));

const getDefaultOption = (name: string): Key | "custom" => {
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

export const getDefaultAttributeBufferState = (name: string, type: AttributeBufferType) => ({
  optionId: getDefaultOption(name),
  value: "[]",
  error: "",
});
