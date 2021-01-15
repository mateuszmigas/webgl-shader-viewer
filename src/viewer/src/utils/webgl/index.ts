import { removeLast } from "../../../../common/array";
import { hasProperty } from "../typeGuards";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";
import { UniformInfo, UniformType } from "./uniform";

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

export const compileShadersFromSource = (
  context: WebGLRenderingContext,
  vertexShaderContent: string,
  fragmentShaderContent: string
) => {
  const vertexShader = compileShader(
    context,
    context.VERTEX_SHADER,
    vertexShaderContent
  );

  const fragmentShader = compileShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShaderContent
  );

  let vertexError: string = undefined;
  if (hasProperty(vertexShader, "error")) {
    vertexError = removeLast(vertexShader.error, 1);
  }

  let fragmentError: string = undefined;
  if (hasProperty(fragmentShader, "error")) {
    fragmentError = removeLast(fragmentShader.error, 1);
  }

  if (vertexError || fragmentError) {
    //todo cleanup
    return [vertexError, fragmentError] as ShaderCompileErrors;
  }

  return createProgram(context, vertexShader, fragmentShader);
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

export const getProgramUniforms = (
  context: WebGLRenderingContext,
  program: WebGLProgram
) => {
  const numUniforms = context.getProgramParameter(
    program,
    context.ACTIVE_UNIFORMS
  );
  const result: { name: string; type: UniformType }[] = [];

  for (let index = 0; index < numUniforms; ++index) {
    const uniform = context.getActiveUniform(program, index);
    result.push({ name: uniform.name, type: uniform.type });
  }

  return result;
};

export const getProgramAttributeBuffers = (
  context: WebGLRenderingContext,
  program: WebGLProgram
) => {
  const numAttributeBuffers = context.getProgramParameter(
    program,
    context.ACTIVE_ATTRIBUTES
  );

  const result: { name: string; type: AttributeBufferType }[] = [];

  for (let index = 0; index < numAttributeBuffers; ++index) {
    const attributeBuffer = context.getActiveAttrib(program, index);
    result.push({ name: attributeBuffer.name, type: attributeBuffer.type });
  }

  return result;
};

export const renderProgram = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  renderInfo: {
    uniforms: UniformInfo[];
    attributeBuffers: AttributeBufferInfo[];
    //textures
  }
) => {
  context.useProgram(program);
  context.viewport(0, 0, context.canvas.width, context.canvas.height);
  context.clearColor(0, 0, 0, 0);
  context.clear(context.COLOR_BUFFER_BIT);

  renderInfo.uniforms.forEach(u => u.setUniform());
  renderInfo.attributeBuffers.forEach(ab => ab.setAttributeBuffer());
  // const numElements = Math.min(
  //   ...renderInfo.attributeBuffers.map((ab) => ab.getElementsCount())
  // );

  const primitiveType = context.TRIANGLES;
  const offset = 0;
  const count = 3;
  context.drawArrays(primitiveType, offset, count);
};

export type ShaderCompileErrors = [
  vertexShaderErrors: string,
  fragmentShaderErrors: string
];
export const formatShaderCompileErrors = (result: ShaderCompileErrors) => {
  const [vertexShaderErrors, fragmentShaderErrors] = result;

  const errors: string[] = [];

  if (vertexShaderErrors) {
    errors.push("VERTEX SHADER:", vertexShaderErrors);
  }

  if (fragmentShaderErrors) {
    errors.push("FRAGMENT SHADER:", fragmentShaderErrors);
  }

  return errors.join("\r\n");
};
