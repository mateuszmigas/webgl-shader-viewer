export const compileShader = (
  renderingContext: WebGLRenderingContext,
  type: GLenum,
  source: string
): WebGLShader | { error: string } => {
  const shader = renderingContext.createShader(type);
  renderingContext.shaderSource(shader, source);
  renderingContext.compileShader(shader);

  const result = renderingContext.getShaderParameter(
    shader,
    renderingContext.COMPILE_STATUS
  );

  if (result) {
    return shader;
  } else {
    const error = renderingContext.getShaderInfoLog(shader);
    renderingContext.deleteShader(shader);
    return {
      error,
    };
  }
};

export const createProgram = (
  renderingContext: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = renderingContext.createProgram();
  renderingContext.attachShader(program, vertexShader);
  renderingContext.attachShader(program, fragmentShader);
  renderingContext.linkProgram(program);

  const result = renderingContext.getProgramParameter(
    program,
    renderingContext.LINK_STATUS
  );

  if (result) {
    return program;
  } else {
    renderingContext.deleteProgram(program);

    throw new Error(
      `Creating program failed: ${renderingContext.getProgramInfoLog(program)}`
    );
  }
};

export class EasyGLAttributeBuffer {}

export class EasyGLUniform {}

export class EasyGLProgram {}
