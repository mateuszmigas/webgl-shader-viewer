import { AttributeBufferType } from "./../../utils/webgl/attributeBuffer";
import { repeat } from "../../../../common/array";
import { assertNever } from "../../utils/typeGuards";
import { customOption } from "../common/constants";

const getDefaultOption = (type: AttributeBufferType) => customOption.id;
const getDefaultValue = (type: AttributeBufferType) => {
  switch (type) {
    case AttributeBufferType.FLOAT_VEC2:
      return repeat(2, 0);
    case AttributeBufferType.FLOAT_VEC3:
      return repeat(3, 0);
    case AttributeBufferType.FLOAT_VEC4:
      return repeat(4, 0);
    default:
      assertNever(type);
  }
};

export const getDefaultProps = (type: AttributeBufferType) => ({
  optionId: getDefaultOption(type),
  value: getDefaultValue(type),
});
