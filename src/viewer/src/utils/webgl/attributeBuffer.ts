import { assertNever } from "../typeGuards";

export enum AttributeBufferType {
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
}

export class AttributeBufferInfo {
  private buffer: WebGLBuffer | null;
  private location: number;
  private count: number = 0;

  constructor(
    private context: WebGLRenderingContext,
    program: WebGLProgram,
    private name: string,
    private type: AttributeBufferType
  ) {
    this.attachToProgram(program);
    this.buffer = context.createBuffer();
  }

  attachToProgram(program: WebGLProgram) {
    this.location = this.context.getAttribLocation(program, this.name);
  }

  setValue(newValue: number[][]) {
    this.count = newValue.length;
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    const flatten = [].concat(...newValue);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      new Float32Array(flatten),
      this.context.STATIC_DRAW
    );
  }

  setAttributeBuffer() {
    if (this.buffer !== null) {
      this.context.enableVertexAttribArray(this.location);
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      const size = getNumComponents(this.type); // 2 components per iteration
      const type = this.context.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      this.context.vertexAttribPointer(this.location, size, type, normalize, stride, offset);
    }
  }

  getAttributeBufferType() {
    return this.type;
  }

  getCount() {
    return this.count;
  }

  deleteBuffer() {
    this.context.deleteBuffer(this.buffer);
    this.buffer = null;
  }
}

const getNumComponents = (bufferType: AttributeBufferType) => {
  switch (bufferType) {
    case AttributeBufferType.FLOAT_VEC2:
      return 2;
    case AttributeBufferType.FLOAT_VEC3:
      return 3;
    case AttributeBufferType.FLOAT_VEC4:
      return 4;
    default:
      assertNever(bufferType);
  }
};
