import { AttributeBufferType } from "./../../utils/webgl/attributeBuffer";
import { customOption } from "../common/constants";

export const getDefaultProps = (type: AttributeBufferType) => ({
  optionId: customOption.id,
  value: "[]",
  isValid: true,
});
