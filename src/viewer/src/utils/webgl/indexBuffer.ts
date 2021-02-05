export class IndexBufferInfo {
  private buffer: WebGLBuffer | null;

  constructor(private context: WebGLRenderingContext) {
    this.buffer = context.createBuffer();
  }

  setValue(indices: number[]) {
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.context.bufferData(
      this.context.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.context.STATIC_DRAW
    );
  }

  setIndexBuffer() {
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  deleteBuffer() {
    this.context.deleteBuffer(this.buffer);
    this.buffer = null;
  }
}
