import { assertNever } from "@utils/typeGuards";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer";
import { validateArrayElements } from "./common";

const getNumElements = (type: AttributeBufferType) => {
  switch (type) {
    case AttributeBufferType.FLOAT_VEC2:
      return 2;
    case AttributeBufferType.FLOAT_VEC3:
      return 3;
    case AttributeBufferType.FLOAT_VEC4:
      return 4;
    default:
      assertNever(type);
  }
};

export const validateAttributeBuffer = (value: string, type: AttributeBufferType) =>
  validateArrayElements(value, getNumElements(type));
