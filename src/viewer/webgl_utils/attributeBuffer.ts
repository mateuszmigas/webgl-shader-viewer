import { assertNever } from "./../../utils";
import { Vector3, Vector4 } from "../components/editVector3";
export enum AttributeBufferType {
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
}

export type AttributeBufferInfo = {
  name: string;
  onRender: () => void;
} & (
  | {
      type: AttributeBufferType.FLOAT_VEC3;
      update: (value: Vector3[]) => void;
    }
  | {
      type: AttributeBufferType.FLOAT_VEC4;
      update: (value: Vector4[]) => void;
    }
);

export const getNumComponents = (bufferType: AttributeBufferType) => {
  switch (bufferType) {
    case AttributeBufferType.FLOAT_VEC3:
      return 3;
    case AttributeBufferType.FLOAT_VEC4:
      return 4;
    default:
      assertNever(bufferType);
  }
};

export const generateAttributeBufferInfos = (
  context: WebGLRenderingContext,
  program: WebGLProgram
) => {
  const numAttributeBuffers = context.getProgramParameter(
    program,
    context.ACTIVE_ATTRIBUTES
  );

  const result: AttributeBufferInfo[] = [];

  for (let index = 0; index < numAttributeBuffers; ++index) {
    const attrib = context.getActiveAttrib(program, index);
    const location = context.getAttribLocation(program, attrib.name);
    const buffer = context.createBuffer();
    const dispose = () => context.deleteBuffer(buffer);
    const numComponents = getNumComponents(attrib.type);
    const onRender = () => {
      context.enableVertexAttribArray(location);
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      const size = 2; // 2 components per iteration
      const type = context.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      context.vertexAttribPointer(
        location,
        size,
        type,
        normalize,
        stride,
        offset
      );
    };

    result.push({
      name: attrib.name,
      type: attrib.type,
      update: (value: number[][]) => {
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        const flatten = [].concat(...value);
        context.bufferData(
          context.ARRAY_BUFFER,
          new Float32Array([0, 0, 0, 0.5, 0.7, 0]),
          context.STATIC_DRAW
        );
      },
      onRender,
      //dispose
    });
  }

  return result;
};
