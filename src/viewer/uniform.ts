import { assertNever } from "./../utils";
import { Vector2, Vector3, Vector4 } from "./components/editVector3";
import { Color3, Color4 } from "./components/editColor";
export enum UniformType {
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
}

//5120 (BYTE), 5121 (UNSIGNED_BYTE), 5122 (SHORT), 5123 (UNSIGNED_SHORT), 5124 (INT),
// 5125 (UNSIGNED_INT), 5126 (FLOAT), 35664 (FLOAT_VEC2),
// , 35667 (INT_VEC2), 35668 (INT_VEC3), 35669 (INT_VEC4), 35670 (BOOL), 35671 (BOOL_VEC2), 35672 (BOOL_VEC3), 35673 (BOOL_VEC4), 35674 (FLOAT_MAT2), 35675 (FLOAT_MAT3), 35676 (FLOAT_MAT4), and 35678 (SAMPLER_2D).

export type UniformInfo =
  | {
      name: string;
      type: UniformType.FLOAT_VEC2;
      update: (value: Vector2) => void;
    }
  | {
      name: string;
      type: UniformType.FLOAT_VEC3;
      update: (value: Vector3 | Color3) => void;
    }
  | {
      name: string;
      type: UniformType.FLOAT_VEC4;
      update: (value: Vector4 | Color4) => void;
    };

export const getUniformSetter = (
  type: UniformType,
  context: WebGLRenderingContext,
  location: WebGLUniformLocation
): ((value: any) => void) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return (value: Vector2) => context.uniform2f(location, ...value);
    case UniformType.FLOAT_VEC3:
      return (value: Vector3) => context.uniform3f(location, ...value);
    case UniformType.FLOAT_VEC4:
      return (value: Vector4) => context.uniform4f(location, ...value);
    default:
      assertNever(type);
  }
};
