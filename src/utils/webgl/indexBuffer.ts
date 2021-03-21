export class IndexBufferInfo {
  private buffer: WebGLBuffer | null;
  private count: number = 0;

  constructor(private context: WebGLRenderingContext) {
    this.buffer = context.createBuffer();
  }

  setValue(newValue: number[]) {
    this.count = newValue.length;
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.context.bufferData(
      this.context.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(newValue),
      this.context.STATIC_DRAW
    );
  }

  setIndexBuffer() {
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  getCount() {
    return this.count;
  }

  deleteBuffer() {
    this.context.deleteBuffer(this.buffer);
    this.buffer = null;
  }
}
