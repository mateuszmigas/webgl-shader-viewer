import {
  AttributeBufferInfo,
  generateAttributeBufferInfos,
} from "./webgl_utils/attributeBuffer";
import { hasProperty, removeLast } from "../utils";
import {
  generateUniformInfos,
  getUniformSetter,
  UniformInfo,
} from "./webgl_utils/uniform";
import { compileShader, createProgram } from "./webgl_utils/utils";

export type CompileErrors = [
  vertexShaderErrors: string,
  fragmentShaderErrors: string
];

export type ShaderController = {
  uniforms: UniformInfo[];
  attributeBuffers: AttributeBufferInfo[];
  render: () => void;
};

export const createWebGLCanvas = (
  className: string
): [
  HTMLCanvasElement,
  {
    compileShaders: (
      vertexShaderContent: string,
      fragmentShaderContent: string
    ) => CompileErrors | ShaderController;
  }
] => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  const context = canvas.getContext("webgl");

  if (!context) {
    //todo move to errors
    throw new Error("Unable to create webgl context");
  }

  const compileShaders = (
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
      return [vertexError, fragmentError] as CompileErrors;
    }

    const program = createProgram(context, vertexShader, fragmentShader);
    const uniforms = generateUniformInfos(context, program);
    const attributeBuffers = generateAttributeBufferInfos(context, program);

    //delete shaders

    return {
      render: () => {
        //webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        console.log("rendering");

        context.useProgram(program);

        // Tell WebGL how to convert from clip space to pixels
        context.viewport(0, 0, context.canvas.width, context.canvas.height);

        // Clear the canvas
        context.clearColor(0, 0, 0, 0);
        context.clear(context.COLOR_BUFFER_BIT);

        uniforms.forEach((u) => u.onRender());
        attributeBuffers.forEach((ab) => ab.onRender());
        const primitiveType = context.TRIANGLES;
        const offset = 0;
        const count = 3;
        context.drawArrays(primitiveType, offset, count);
      },
      uniforms,
      attributeBuffers,
    } as ShaderController;
  };

  return [
    canvas,
    {
      compileShaders,
    },
  ];
};
