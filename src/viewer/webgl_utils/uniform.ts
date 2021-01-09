import { assertNever } from "../../utils";
import { Vector2, Vector3, Vector4 } from "../components/editVector3";

export enum UniformType {
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
  SAMPLER_2D = 35678,
}

//5120 (BYTE), 5121 (UNSIGNED_BYTE), 5122 (SHORT), 5123 (UNSIGNED_SHORT), 5124 (INT),
// 5125 (UNSIGNED_INT), 5126 (FLOAT), 35664 (FLOAT_VEC2),
// , 35667 (INT_VEC2), 35668 (INT_VEC3), 35669 (INT_VEC4), 35670 (BOOL), 35671 (BOOL_VEC2), 35672 (BOOL_VEC3), 35673 (BOOL_VEC4), 35674 (FLOAT_MAT2), 35675 (FLOAT_MAT3), 35676 (FLOAT_MAT4)

export class UniformInfo<T = any> {
  private value: T | null;
  private setter: (value: T) => void;

  constructor(
    context: WebGLRenderingContext,
    program: WebGLProgram,
    private name: string,
    private type: UniformType
  ) {
    const location = context.getUniformLocation(program, name);
    this.setter = createUniformSetter(type, context, location);
  }

  setValue(newValue: T) {
    this.value = newValue;
  }

  setUniform() {
    if (this.value !== null) {
      this.setter(this.value);
    }
  }

  getUniformType() {
    return this.type;
  }

  dispose() {}
}

const createUniformSetter = (
  type: UniformType,
  context: WebGLRenderingContext,
  location: WebGLUniformLocation
): ((value: any) => void) => {
  console.log("creating setter for", type);

  switch (type) {
    case UniformType.FLOAT_VEC2:
      return (value: Vector2) => context.uniform2f(location, ...value);
    case UniformType.FLOAT_VEC3:
      return (value: Vector3) => context.uniform3f(location, ...value);
    case UniformType.FLOAT_VEC4:
      return (value: Vector4) => context.uniform4f(location, ...value);
    case UniformType.SAMPLER_2D:
      return (value: { slot: number; textureData: boolean }) => {
        //context.texi(value.slot);
      };
    default:
      assertNever(type);
  }
};
