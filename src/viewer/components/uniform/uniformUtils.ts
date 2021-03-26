import { repeat } from "@utils/array";
import { assertNever } from "@utils/typeGuards";
import { UniformType } from "@utils/webgl/uniform";
import { customOption } from "@common/constants";

const getDefaultOption = () => customOption.id;
const getDefaultValue = (type: UniformType) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return repeat(2, 1);
    case UniformType.FLOAT_VEC3:
      return repeat(3, 1);
    case UniformType.FLOAT_VEC4:
      return repeat(4, 1);
    case UniformType.FLOAT_MAT4:
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    default:
      assertNever(type);
  }
};

export const getDefaultProps = (type: UniformType) => ({
  optionId: getDefaultOption(),
  value: getDefaultValue(type),
});
