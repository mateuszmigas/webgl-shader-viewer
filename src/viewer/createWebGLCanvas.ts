import { hasProperty, observeElementBoundingRect, removeLast } from "../utils";
import {
  compileShader,
  createProgram,
  ShaderCompileErrors,
} from "./webgl_utils/utils";

export const compileShaders = (
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

export const createWebGLCanvas = (
  className: string
): [
  HTMLCanvasElement,
  {
    context: WebGLRenderingContext;
  }
] => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  const context = canvas.getContext("webgl");

  observeElementBoundingRect(canvas, (rect) => {
    canvas.width = rect.width;
    canvas.height = rect.height;
  });

  if (!context) {
    //todo move to errors
    throw new Error("Unable to create webgl context");
  }

  return [
    canvas,
    {
      context,
    },
  ];
};
