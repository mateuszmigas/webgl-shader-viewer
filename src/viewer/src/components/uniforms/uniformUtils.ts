import { repeat } from "../../../../common/array";
import { assertNever } from "../../utils/typeGuards";
import { UniformType } from "../../utils/webgl/uniform";
import { customOption } from "../common/constants";

const getDefaultOption = (type: UniformType) => customOption.id;
const getDefaultValue = (type: UniformType) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return repeat(2, 0);
    case UniformType.FLOAT_VEC3:
      return repeat(3, 0);
    case UniformType.FLOAT_VEC4:
      return repeat(4, 0);
    case UniformType.FLOAT_MAT4:
      return repeat(16, 0);
    default:
      assertNever(type);
  }
};

export const getDefaultProps = (type: UniformType) => ({
  optionId: getDefaultOption(type),
  value: getDefaultValue(type),
});
