import { CompositeKeyMap } from "../../utils/compositeKeyMap";
import { Unsubscribe, foo } from "../../../../common/types";
import { Vector2, Vector3, Vector4 } from "../../components/inputNumber";
import { withLabel } from "../../components/wrappers";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";

console.log(foo);
type CacheKey = {
  name: string;
  type: AttributeBufferType;
};

type CacheValue = {
  component: HTMLElement;
  attributeBufferInfo: AttributeBufferInfo;
  dispose: () => void;
};

const componentCache = new CompositeKeyMap<CacheKey, CacheValue>(
  key => `${key.name};${key.type}`
);

const rebuildCache = (newValues: { key: CacheKey; value: CacheValue }[]) => {
  //dispose here
  //abi.dispose();
  //componentCache.clear();
  //attributeBufferComponents.forEach(uc => componentCache.set(uc.key, uc.value));
};

type AttributeBufferBinding = {
  name: string;
  type: string;
  onChange: (value: any) => void;
  //subscribeToChange:

  //onChange
};

export const createAttributeBufferComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  attributeBuffers: { name: string; type: AttributeBufferType }[],
  attributeBufferBindings?: AttributeBufferBinding[]
) => {
  const components = attributeBuffers.map(attributeBuffer => {
    const key = {
      ...attributeBuffer,
    };

    const fromCache = componentCache.get(key);

    if (fromCache) {
      fromCache.attributeBufferInfo.attachToProgram(program);
      return { key, value: fromCache };
    } else {
      const attributeBufferInfo = new AttributeBufferInfo(
        context,
        program,
        attributeBuffer.name,
        attributeBuffer.type
      );

      const [element, unsubscribe] = createAttributeBufferComponent(
        attributeBufferInfo
      );

      return {
        key,
        value: {
          component: withLabel(element, attributeBuffer.name),
          attributeBufferInfo,
          dispose: () => {
            attributeBufferInfo.deleteBuffer();
            unsubscribe();
          },
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(c => c.value);
};

const createAttributeBufferComponent = (
  attributeBufferInfo: AttributeBufferInfo
): [HTMLElement, Unsubscribe] => {
  switch (attributeBufferInfo.getAttributeBufferType()) {
    case AttributeBufferType.FLOAT_VEC3:
      return [
        createAttributeBufferInputVec3(value => {
          attributeBufferInfo.setValue(value);
        }),
        () => {},
      ];
    //component
    case AttributeBufferType.FLOAT_VEC4:
      const initialValue: Vector4[] = [
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
      ];
      attributeBufferInfo.setValue(initialValue);
      return [
        createAttributeBufferInputVec4(initialValue, value => {
          attributeBufferInfo.setValue(value);
        }),
        () => {},
      ];
    default:
      return [createAttributeBufferNotSupported(), () => {}];
  }
};

const createAttributeBufferNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported attribute buffer";
  return div;
};

//vec3
//binding

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
        const xxx = result.every(e =>
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
        const xxx = result.every(e =>
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
