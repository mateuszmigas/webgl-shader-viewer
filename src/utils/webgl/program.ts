import { DrawOptions } from "./types";
import { AttributeBufferType, AttributeBufferInfo } from "./attributeBuffer/attributeBuffer";
import { ShaderCompileErrors } from "./compileErrors";
import { IndexBufferInfo } from "./indexBuffer/indexBuffer";
import { TextureInfo } from "./texture/texture";
import { UniformType, UniformInfo, SAMPLER_2D } from "./uniform/uniform";

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

    if (uniform.type === SAMPLER_2D) {
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
  context.useProgram(program);
  context.viewport(0, 0, context.canvas.width, context.canvas.height);
  context.clearDepth(1.0);
  context.enable(context.DEPTH_TEST);
  context.depthFunc(context.LEQUAL);
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

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
