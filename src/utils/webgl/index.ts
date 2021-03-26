import { translations } from "@common/translations";
import { removeLast } from "@utils/string";
import { TextureInfo } from "./textureInfo";
import { IndexBufferInfo } from "./indexBuffer";
import { hasProperty } from "../typeGuards";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";
import { UniformInfo, UniformType } from "./uniform";

export type DrawMode = "elements" | "arrays";
export type DrawOptions = {
  drawMode: DrawMode;
};

export const compileShader = (
  renderingContext: WebGLRenderingContext,
  type: GLenum,
  source: string
): WebGLShader | { error: string } => {
  const shader = renderingContext.createShader(type);
  renderingContext.shaderSource(shader, source);
  renderingContext.compileShader(shader);

  const result = renderingContext.getShaderParameter(shader, renderingContext.COMPILE_STATUS);

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
): WebGLProgram | ShaderCompileErrors => {
  const vertexShader = compileShader(context, context.VERTEX_SHADER, vertexShaderContent);

  const fragmentShader = compileShader(context, context.FRAGMENT_SHADER, fragmentShaderContent);

  let vertexError: string = undefined;
  if (hasProperty(vertexShader, "error")) {
    vertexError = removeLast(vertexShader.error, 1);
  }

  let fragmentError: string = undefined;
  if (hasProperty(fragmentShader, "error")) {
    fragmentError = removeLast(fragmentShader.error, 1);
  }

  if (vertexError || fragmentError) {
    return ["", vertexError, fragmentError] as ShaderCompileErrors;
  }

  return createProgram(context, vertexShader, fragmentShader);
};

export const createProgram = (
  renderingContext: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | ShaderCompileErrors => {
  const program = renderingContext.createProgram();
  renderingContext.attachShader(program, vertexShader);
  renderingContext.attachShader(program, fragmentShader);
  renderingContext.linkProgram(program);

  const result = renderingContext.getProgramParameter(program, renderingContext.LINK_STATUS);

  if (result) {
    return program;
  } else {
    const infoLog = renderingContext.getProgramInfoLog(program);
    renderingContext.deleteProgram(program);
    return [infoLog, "", ""];
  }
};

export const getProgramUniforms = (
  context: WebGLRenderingContext,
  program: WebGLProgram
): {
  dataUniforms: { name: string; type: UniformType }[];
  textureUniforms: { name: string; unit: number }[];
} => {
  const numUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
  const dataUniforms: { name: string; type: UniformType }[] = [];
  const textureUniforms: { name: string; unit: number }[] = [];

  for (let index = 0; index < numUniforms; ++index) {
    const uniform = context.getActiveUniform(program, index);

    //sampler2D
    if (uniform.type === 35678) {
      textureUniforms.push({
        name: uniform.name,
        unit: textureUniforms.length,
      });
    } else {
      dataUniforms.push({ name: uniform.name, type: uniform.type });
    }
  }

  return { dataUniforms, textureUniforms };
};

export const getProgramAttributeBuffers = (
  context: WebGLRenderingContext,
  program: WebGLProgram
) => {
  const numAttributeBuffers = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);

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
    uniformInfos: UniformInfo[];
    textureInfos: TextureInfo[];
    attributeBufferInfos: AttributeBufferInfo[];
    indexBufferInfo: IndexBufferInfo;
  },
  drawOptions: DrawOptions
) => {
  //todo
  context.useProgram(program);
  context.viewport(0, 0, context.canvas.width, context.canvas.height);
  //context.clearColor(0, 0, 0, 0);
  //context.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  context.clearDepth(1.0); // Clear everything
  // gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  context.enable(context.DEPTH_TEST);

  context.depthFunc(context.LEQUAL); // Near things obscure far things
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
  //context.enable(context.CULL_FACE);

  renderInfo.uniformInfos.forEach(u => u.prepareForRender());
  renderInfo.textureInfos.forEach(u => u.prepareForRender());
  renderInfo.attributeBufferInfos.forEach(ab => ab.setAttributeBuffer());

  const primitiveType = context.TRIANGLES;
  const offset = 0;

  if (drawOptions.drawMode === "arrays") {
    const numElements = Math.min(...renderInfo.attributeBufferInfos.map(ab => ab.getCount()));
    context.drawArrays(primitiveType, offset, numElements);
  } else {
    renderInfo.indexBufferInfo.setIndexBuffer();
    context.drawElements(
      primitiveType,
      renderInfo.indexBufferInfo.getCount(),
      context.UNSIGNED_SHORT,
      offset
    );
  }
};

export type ShaderCompileErrors = [
  programErrors: string,
  vertexShaderErrors: string,
  fragmentShaderErrors: string
];
export const formatShaderCompileErrors = (result: ShaderCompileErrors) => {
  const [programErrors, vertexShaderErrors, fragmentShaderErrors] = result;

  const errors: string[] = [];

  if (programErrors) {
    errors.push(translations.errors.program, programErrors);
  }

  if (vertexShaderErrors) {
    errors.push(translations.errors.vertexShader, vertexShaderErrors);
  }

  if (fragmentShaderErrors) {
    errors.push(translations.errors.fragmentShader, fragmentShaderErrors);
  }

  return errors.join("\r\n");
};
