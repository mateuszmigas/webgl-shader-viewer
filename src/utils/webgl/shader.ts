import { removeLast } from "@utils/string";
import { hasProperty } from "../typeGuards";
import { ShaderCompileErrors } from "./compileErrors";
import { createProgram } from "./program";

const compileShader = (
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
