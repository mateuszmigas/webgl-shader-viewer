import { hasProperty, removeLast } from "../utils";
import { getUniformSetter, UniformInfo } from "./uniform";
import { compileShader, createProgram } from "./webgl_utils/utils";

export type AttributeBufferInfo = {};

export type CompileErrors = [
  vertexShaderErrors: string,
  fragmentShaderErrors: string
];

export type ShaderController = {
  uniforms: UniformInfo[];
  render: () => void;
};

export const generateUniformInfos = (
  context: WebGLRenderingContext,
  program: WebGLProgram
): UniformInfo[] => {
  const numUniforms = context.getProgramParameter(
    program,
    context.ACTIVE_UNIFORMS
  );
  const result: UniformInfo[] = [];

  for (let index = 0; index < numUniforms; ++index) {
    const uniform = context.getActiveUniform(program, index);
    const location = context.getUniformLocation(program, uniform.name);
    const update = getUniformSetter(uniform.type, context, location);

    result.push({
      name: uniform.name,
      type: uniform.type,
      update,
    });
  }

  return result;
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

    //createController90

    // const numUniforms = context.getProgramParameter(
    //   program,
    //   context.ACTIVE_UNIFORMS
    // );
    // const uniformSetters = {};
    // console.log("getting uniforms", numUniforms);

    // for (let ii = 0; ii < numUniforms; ++ii) {
    //   const uniformInfo = context.getActiveUniform(program, ii);
    //   // if (isBuiltIn(uniformInfo)) {
    //   //     continue;
    //   // }
    //   let name = uniformInfo.name;
    //   console.log("uniform:", uniformInfo);
    // }

    //program.
    //generate program info

    const uniforms = generateUniformInfos(context, program);
    // uniforms.push({
    //   name: "uniform1",
    //   type: "vec3",
    //   update: () => {},
    // });

    // uniforms.push({
    //   name: "uniform2",
    //   type: "vec2",
    //   update: () => {},
    // });
    //fragment: { errors: }
    //fragment: { errors: }

    //delete shaders

    return {
      render: () => {
        console.log("rendering");
      },
      uniforms,
    } as ShaderController;
  };

  return [
    canvas,
    {
      compileShaders,
    },
  ];
};
