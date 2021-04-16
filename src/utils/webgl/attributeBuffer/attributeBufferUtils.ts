import { getSerializedProp, MeshInfo } from "@meshes";
import { customOption } from "@common/constants";
import { translations } from "@common/translations";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";

const positions = getSerializedProp("positions");
const textureCoordinates = getSerializedProp("textureCoordinates");
const normals = getSerializedProp("normals");
const colors = getSerializedProp("colors");

const bindings = new Map<
  keyof MeshInfo,
  { display: string; type: AttributeBufferType; getValue: (id: string) => any }
>([
  [
    "positions",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: translations.bindings.meshPositions,
      getValue: id => positions.get(id),
    },
  ],
  [
    "textureCoordinates",
    {
      type: AttributeBufferType.FLOAT_VEC2,
      display: translations.bindings.meshTextureCoordinates,
      getValue: id => textureCoordinates.get(id),
    },
  ],
  [
    "normals",
    {
      type: AttributeBufferType.FLOAT_VEC3,
      display: translations.bindings.meshNormals,
      getValue: id => normals.get(id),
    },
  ],
  [
    "colors",
    {
      type: AttributeBufferType.FLOAT_VEC4,
      display: translations.bindings.meshColors,
      getValue: id => colors.get(id),
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
  if (lowerCaseName.includes("normal")) {
    return "normals";
  }
  return customOption.id;
};

export const getAttributeBufferBinding = (name: string) => bindings.get(name as keyof MeshInfo);

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
