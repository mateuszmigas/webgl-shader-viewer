import { Matrix4Array, Vector2Array, Vector3Array, Vector4Array } from "../../types";
import { assertNever } from "../../typeGuards";

export enum UniformType {
  FLOAT = 5126,
  BYTE = 5120,
  UNSIGNED_BYTE = 5121,
  SHORT = 5122,
  UNSIGNED_SHORT = 5123,
  INT = 5124,
  UNSIGNED_INT = 5125,
  INT_VEC2 = 35667,
  INT_VEC3 = 35668,
  INT_VEC4 = 35669,
  BOOL = 35670,
  BOOL_VEC2 = 35671,
  BOOL_VEC3 = 35672,
  BOOL_VEC4 = 35673,
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
  FLOAT_MAT2 = 35674,
  FLOAT_MAT3 = 35675,
  FLOAT_MAT4 = 35676,
}

export const SAMPLER_2D = 35678;

export class UniformInfo<T = any> {
  private value: T | null = null;
  private setter: (value: T) => void;

  constructor(
    private context: WebGLRenderingContext,
    program: WebGLProgram,
    private name: string,
    private type: UniformType
  ) {
    this.attachToProgram(program);
  }

  attachToProgram(program: WebGLProgram) {
    const location = this.context.getUniformLocation(program, this.name);
    this.setter = createUniformSetter(this.type, this.context, location);
  }

  setValue(newValue: T) {
    this.value = newValue;
  }

  prepareForRender() {
    if (this.value !== null) {
      this.setter(this.value);
    }
  }

  getUniformType() {
    return this.type;
  }

  getUniformName() {
    return this.name;
  }

  dispose() {}
}

const createUniformSetter = (
  type: UniformType,
  context: WebGLRenderingContext,
  location: WebGLUniformLocation
): ((value: any) => void) => {
  switch (type) {
    case UniformType.FLOAT:
      return (value: number) => context.uniform1f(location, value);
    case UniformType.BOOL:
    case UniformType.BYTE:
    case UniformType.UNSIGNED_BYTE:
    case UniformType.SHORT:
    case UniformType.UNSIGNED_SHORT:
    case UniformType.INT:
    case UniformType.UNSIGNED_INT:
      return (value: number) => context.uniform1i(location, value);
    case UniformType.INT_VEC2:
    case UniformType.BOOL_VEC2:
      return (value: Vector2Array) => context.uniform2i(location, ...value);
    case UniformType.INT_VEC3:
    case UniformType.BOOL_VEC3:
      return (value: Vector3Array) => context.uniform3i(location, ...value);
    case UniformType.INT_VEC4:
    case UniformType.BOOL_VEC4:
      return (value: Vector4Array) => context.uniform4i(location, ...value);
    case UniformType.FLOAT_VEC2:
      return (value: Vector2Array) => context.uniform2f(location, ...value);
    case UniformType.FLOAT_VEC3:
      return (value: Vector3Array) => context.uniform3f(location, ...value);
    case UniformType.FLOAT_VEC4:
      return (value: Vector4Array) => context.uniform4f(location, ...value);
    case UniformType.FLOAT_MAT2:
      return (value: Matrix4Array) => context.uniformMatrix2fv(location, false, value);
    case UniformType.FLOAT_MAT3:
      return (value: Matrix4Array) => context.uniformMatrix3fv(location, false, value);
    case UniformType.FLOAT_MAT4:
      return (value: Matrix4Array) => context.uniformMatrix4fv(location, false, value);
    default:
      assertNever(type);
  }
};
