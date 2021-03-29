export enum AttributeBufferType {
  FLOAT_VEC2 = 35664,
  FLOAT_VEC3 = 35665,
  FLOAT_VEC4 = 35666,
}

export class AttributeBufferInfo {
  private buffer: WebGLBuffer | null;
  private location: number;
  private elementCount = 0;
  private elementSize = 0;

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
    this.elementCount = newValue.length;
    this.elementSize = newValue[0]?.length ?? 1;
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
      const size = this.elementSize;
      const type = this.context.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.context.vertexAttribPointer(this.location, size, type, normalize, stride, offset);
    }
  }

  getAttributeBufferType() {
    return this.type;
  }

  getCount() {
    return this.elementCount;
  }

  deleteBuffer() {
    this.context.deleteBuffer(this.buffer);
    this.buffer = null;
  }
}
