import { AttributeBufferType } from "./webgl_utils/attributeBuffer";
import { withLabel } from "./components/wrappers";
import { createUniformComponent } from "./webgl_utils/uniformComponent";
import { CompositeKeyMap } from "./compositeKeyMap";
import { ShaderController } from "./createWebGLCanvas";
import { UniformType } from "./webgl_utils/uniform";
import { createAttributeBufferComponent } from "./webgl_utils/attributeBufferComponent";

const uniformsCache = new CompositeKeyMap<
  { name: string; type: UniformType },
  HTMLElement
>((key) => `${key.name};${key.type}`);

const attributeBuffersCache = new CompositeKeyMap<
  { name: string; type: AttributeBufferType },
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

  const attributeBufferElements = shaderController.attributeBuffers.map(
    (attributeBuffer) => {
      const componentFromCache = attributeBuffersCache.get({
        ...attributeBuffer,
      });

      if (componentFromCache) {
        return componentFromCache;
      } else {
        const component = withLabel(
          createAttributeBufferComponent(
            attributeBuffer,
            shaderController.render
          ),
          "",
          attributeBuffer.name
        );
        attributeBuffersCache.set({ ...attributeBuffer }, component);
        return component;
      }
    }
  );

  attributeBufferElements.forEach((e) => element.appendChild(e));

  shaderController.render();
};
