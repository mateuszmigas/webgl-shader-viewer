import { isPowerOf2 } from "../math";

export class TextureInfo {
  private texture: WebGLTexture | null;
  private location: WebGLUniformLocation;

  constructor(
    private context: WebGLRenderingContext,
    program: WebGLProgram,
    private name: string,
    private unit: number
  ) {
    this.attachToProgram(program);
    this.texture = context.createTexture();
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.setPlaceholderTexture();
  }

  attachToProgram(program: WebGLProgram) {
    this.location = this.context.getUniformLocation(program, this.name);
  }

  setUnit(newUnit: number) {
    this.unit = newUnit;
  }

  setSource(source: TexImageSource) {
    const level = 0;
    const internalFormat = this.context.RGBA;
    const srcFormat = this.context.RGBA;
    const srcType = this.context.UNSIGNED_BYTE;
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      source
    );
    //Generate mipmaps for power of 2 images
    if (isPowerOf2(source.width) && isPowerOf2(source.height)) {
      this.context.generateMipmap(this.context.TEXTURE_2D);
    } else {
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_WRAP_S,
        this.context.CLAMP_TO_EDGE
      );
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_WRAP_T,
        this.context.CLAMP_TO_EDGE
      );
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_MIN_FILTER,
        this.context.LINEAR
      );
    }
  }

  prepareForRender() {
    if (this.texture !== null) {
      this.context.activeTexture(this.context.TEXTURE0 + this.unit);
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.uniform1i(this.location, this.unit);
    }
  }

  deleteTexture() {
    this.context.deleteTexture(this.texture);
    this.texture = null;
  }

  private setPlaceholderTexture() {
    const level = 0;
    const internalFormat = this.context.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.context.RGBA;
    const srcType = this.context.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 0]);
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );
  }
}
