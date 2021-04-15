import { translations } from "@common/translations";

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
