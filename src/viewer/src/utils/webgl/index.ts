import { TextureInfo } from "./textureInfo";
import { IndexBufferInfo } from "./indexBuffer";
import { removeLast } from "../../../../common/array";
import { hasProperty } from "../typeGuards";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";
import { UniformInfo, UniformType } from "./uniform";
import { Observable } from "../observable";
//import { createAttributeBufferComponents } from "./attributeBufferComponent";
import { getTextureInfos } from "./textureInfoStore";
import { UniformBinding, createUniformComponents } from "./uniformComponent";

export type DrawOptions = {
  drawMode: "elements" | "arrays";
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

  const result = renderingContext.getProgramParameter(program, renderingContext.LINK_STATUS);

  if (result) {
    return program;
  } else {
    const infoLog = renderingContext.getProgramInfoLog(program);
    renderingContext.deleteProgram(program);
    throw new Error(`Creating program failed: ${infoLog}`);
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
    } else dataUniforms.push({ name: uniform.name, type: uniform.type });
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
  context.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
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
      renderInfo.indexBufferInfo.getCount(), //numElements,
      context.UNSIGNED_SHORT,
      offset
    );
  }
};

export type ShaderCompileErrors = [vertexShaderErrors: string, fragmentShaderErrors: string];
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

// export const createComponentsForProgram = (
//   context: WebGLRenderingContext,
//   program: WebGLProgram,
//   bindings: {
//     uniform: Map<string, UniformBinding>;
//     mesh: Map<
//       string,
//       {
//         name: string;
//         type: AttributeBufferType;
//         value: Observable<any[]>;
//       }
//     >;
//   }
// ) => {
//   const programUniforms = getProgramUniforms(context, program);
//   const programAttributeBuffers = getProgramAttributeBuffers(context, program);

//   const uniformComponents = createUniformComponents(
//     context,
//     program,
//     programUniforms.dataUniforms,
//     Array.from(bindings.uniform.values())
//   );

//   const textureComponents = getTextureInfos(context, program, programUniforms.textureUniforms);

//   const attributeBufferComponents = createAttributeBufferComponents(
//     context,
//     program,
//     programAttributeBuffers,
//     Array.from(bindings.mesh.values())
//   );
//   return { uniformComponents, textureComponents, attributeBufferComponents };
// };
