import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";
import { Vector2, Vector3, Vector4 } from "../components/editVector3";
import { CompositeKeyMap } from "../compositeKeyMap";
import { withLabel } from "../components/wrappers";

const attributeBufferComponentCache = new CompositeKeyMap<
  { name: string; type: AttributeBufferType },
  HTMLElement
>((key) => `${key.name};${key.type}`);

export const createAttributeBufferComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  render: () => void,
  attributeBuffers: { name: string; type: AttributeBufferType }[]
) => {
  const attributeBufferComponents = attributeBuffers.map((u) => {
    const key = {
      ...u,
    };

    const componentFromCache = attributeBufferComponentCache.get(key);

    if (componentFromCache) {
      return { key, component: componentFromCache };
    } else {
      const attributeBufferInfo = new AttributeBufferInfo(
        context,
        program,
        u.name,
        u.type
      );
      const component = withLabel(
        createattributeBufferComponent(attributeBufferInfo, render),
        "",
        u.name
      );
      attributeBufferComponentCache.set(key, component);
      return { key, component: component };
    }
  });

  attributeBufferComponentCache.clear();
  attributeBufferComponents.forEach((uc) =>
    attributeBufferComponentCache.set(uc.key, uc.component)
  );
  return attributeBufferComponents.map((uc) => uc.component);
};

const createattributeBufferComponent = (
  attributeBufferInfo: AttributeBufferInfo,
  render: () => void
) => {
  switch (attributeBufferInfo.getAttributeBufferType()) {
    case AttributeBufferType.FLOAT_VEC3:
      return createAttributeBufferInputVec3((value) => {
        attributeBufferInfo.setValue(value);
        render();
      });
    case AttributeBufferType.FLOAT_VEC4:
      const initialValue: Vector4[] = [
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
      ];
      attributeBufferInfo.setValue(initialValue);
      return createAttributeBufferInputVec4(initialValue, (value) => {
        attributeBufferInfo.setValue(value);
        render();
      });
    default:
      return createAttributeBufferNotSupported();
  }
};

const createAttributeBufferNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported attribute buffer";
  return div;
};

const createAttributeBufferInputVec3 = (update: (value: Vector3[]) => void) => {
  const input = document.createElement("input");
  //const itemElement = { element: input, value };
  //Object.assign(input, inputOptions);
  input.className = "edit-input";
  input.oninput = () => {
    try {
      const result = JSON.parse(input.value);
      console.log("result", result);

      if (!Array.isArray(result)) {
        console.log("this is not an array type");
      } else {
        const xxx = result.every((e) =>
          Array.isArray(e) ? e.length === 3 : false
        );
        if (!xxx) {
          console.log("not every element id the arra is same size");
        }
      }
      update(result);
    } catch (error) {
      console.log("this is not a json");
    }
  };

  //Wrong format! Should be [[x1,y1], [x2,y2], ...]
  return input;
};

const createAttributeBufferInputVec4 = (
  initialValue: Vector4[],
  update: (value: Vector4[]) => void
) => {
  const input = document.createElement("input");
  //const itemElement = { element: input, value };
  //Object.assign(input, inputOptions);
  input.className = "edit-input";
  input.value = JSON.stringify(initialValue);
  input.oninput = () => {
    try {
      const result = JSON.parse(input.value);
      //console.log("result", result);

      if (!Array.isArray(result)) {
        // console.log("this is not an array type");
      } else {
        const xxx = result.every((e) =>
          Array.isArray(e) ? e.length === 4 : false
        );
        if (!xxx) {
          //  console.log("not every element id the arra is same size");
        }
      }
      update(result);
    } catch (error) {
      console.log("this is not a json");
    }
  };
  //Wrong format! Should be [[x1,y1], [x2,y2], ...]
  return input;
};
