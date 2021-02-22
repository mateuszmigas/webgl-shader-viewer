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
  }

  attachToProgram(program: WebGLProgram) {
    this.location = this.context.getUniformLocation(program, this.name);
  }

  private isPowerOf2 = (value: number) => {
    return (value & (value - 1)) == 0;
  };

  setUrl(url: string) {
    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = this.context.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.context.RGBA;
    const srcType = this.context.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
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
    const image = new Image();
    image.onload = () => {
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.texImage2D(
        this.context.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        this.context.generateMipmap(this.context.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
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
    };
    image.src = url;
  }

  prepareForRender() {
    if (this.texture !== null) {
      this.context.activeTexture(this.context.TEXTURE + this.unit);
      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.uniform1i(this.location, this.unit);
    }
  }

  deleteTexture() {
    this.context.deleteTexture(this.texture);
    this.texture = null;
  }
}
