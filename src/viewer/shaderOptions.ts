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
  console.log("updating shader options");

  const uniformElements = shaderController.uniforms.map((uniform) => {
    const componentFromCache = uniformsCache.get({
      ...uniform,
    });

    if (componentFromCache) {
      console.log("component found", uniform);

      return componentFromCache;
    } else {
      console.log("crating new comp");

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

  // element.appendChild(withLabel(createColor4()[0], "", "u_color"));
  // element.appendChild(withLabel(createVector4()[0], "", "u_diffuse"));
  // const [mat3el, mat3con] = createMatrix3((newval) => console.log(newval));
  // const [ediff, cdiff] = createDropdown(
  //   (sel) => {
  //     if (!sel) return;
  //     if (sel.id === "0") {
  //       mat3con.setReadonly(false);
  //     }
  //     if (sel.id === "1") {
  //       mat3con.setReadonly(true);
  //     }
  //   },
  //   "",
  //   { emptyItem: false }
  // );
  // cdiff.setItems([
  //   { id: "0", display: "Color picker" },
  //   { id: "1", display: "Custom2" },
  // ]);
  // cdiff.setSelectedItemById("0");
  // element.appendChild(
  //   withLabel(
  //     createDiv("column-with-gap", [ediff, mat3el]),
  //     "",
  //     "dobre diffuse"
  //   )
  // );
  // element.appendChild(
  //   withLabel(
  //     createDiv("column-with-gap", [
  //       createDropdown((newFragment) => {})[0],
  //       createMatrix3((newval) => console.log(newval))[0],
  //     ]),
  //     "",
  //     "u_diffuse2"
  //   )
  // );
  // element.appendChild(
  //   withLabel(
  //     createDiv("column-with-gap", [
  //       createDropdown((newFragment) => {})[0],
  //       createMatrix3((newval) => console.log(newval))[0],
  //     ]),
  //     "",
  //     "u_diffuse2"
  //   )
  // );
};
