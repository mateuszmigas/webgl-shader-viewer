import { withLabel } from "./components/wrappers";
import { createUniformComponent } from "./uniformComponent";
import { CompositeKeyMap } from "./compositeKeyMap";
import { ShaderController } from "./createWebGLCanvas";
import { UniformType } from "./uniform";

const uniformsCache = new CompositeKeyMap<
  { name: string; type: UniformType },
  HTMLElement
>((key) => `${key.name};${key.type}`);

export const appendWithShaderOptions = (
  element: HTMLElement,
  shaderController: ShaderController
) => {
  const uniformElements = shaderController.uniforms.map((uniform) => {
    const componentFromCache = uniformsCache.get({
      ...uniform,
    });

    if (componentFromCache) {
      return componentFromCache;
    } else {
      const component = withLabel(
        createUniformComponent(uniform, shaderController.render),
        "",
        uniform.name
      );
      uniformsCache.set({ ...uniform }, component);
      return component;
    }
  });

  uniformElements.forEach((e) => element.appendChild(e));
};
