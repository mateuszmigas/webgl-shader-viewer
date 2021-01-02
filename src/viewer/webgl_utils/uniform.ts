import { assertNever } from "../../utils";
import { Vector2, Vector3, Vector4 } from "../components/editVector3";
import { Color3, Color4 } from "../components/editColor";

export enum UniformType {
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
  SAMPLER_2D = 35678,
}

//5120 (BYTE), 5121 (UNSIGNED_BYTE), 5122 (SHORT), 5123 (UNSIGNED_SHORT), 5124 (INT),
// 5125 (UNSIGNED_INT), 5126 (FLOAT), 35664 (FLOAT_VEC2),
// , 35667 (INT_VEC2), 35668 (INT_VEC3), 35669 (INT_VEC4), 35670 (BOOL), 35671 (BOOL_VEC2), 35672 (BOOL_VEC3), 35673 (BOOL_VEC4), 35674 (FLOAT_MAT2), 35675 (FLOAT_MAT3), 35676 (FLOAT_MAT4)

export type UniformInfo = { name: string; onRender: () => void } & (
  | {
      type: UniformType.FLOAT_VEC2;
      update: (value: Vector2) => void;
    }
  | {
      type: UniformType.FLOAT_VEC3;
      update: (value: Vector3 | Color3) => void;
    }
  | {
      type: UniformType.FLOAT_VEC4;
      update: (value: Vector4 | Color4) => void;
    }
  | {
      type: UniformType.SAMPLER_2D;
      update: (value: { slot: number; textureData: boolean }) => void;
    }
);

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
    case UniformType.SAMPLER_2D:
      return (value: { slot: number; textureData: boolean }) => {
        //context.texi(value.slot);
      };
    default:
      assertNever(type);
  }
};

export const generateUniformInfos = (
  context: WebGLRenderingContext,
  program: WebGLProgram
): UniformInfo[] => {
  const numUniforms = context.getProgramParameter(
    program,
    context.ACTIVE_UNIFORMS
  );

  const result: UniformInfo[] = [];

  for (let index = 0; index < numUniforms; ++index) {
    const uniform = context.getActiveUniform(program, index);
    const location = context.getUniformLocation(program, uniform.name);
    const setter = getUniformSetter(uniform.type, context, location);
    let currentValue: unknown = undefined;
    const onRender = () => {
      console.log("setting", currentValue);

      setter(currentValue);
    };

    result.push({
      name: uniform.name,
      type: uniform.type,
      update: (value: unknown) => (currentValue = value),
      onRender,
    });
  }

  return result;
};
