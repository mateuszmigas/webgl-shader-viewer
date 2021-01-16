import { createElementsDropdown } from "./../../components/dropdown";
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
  type: AttributeBufferType;
  subscribeToChange: (newValue: any) => Unsubscribe;
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

      const customElement = createAttributeBufferComponent(attributeBufferInfo);

      const [bindingOptions, unsubscribe] = createBindingOptions(
        value => {
          attributeBufferInfo.setValue(value);
        },
        attributeBufferBindings.filter(
          b => b.type === attributeBufferInfo.getAttributeBufferType()
        ),
        () => null //todo
      );

      const element = bindingOptions.length
        ? createElementsDropdown([
            createCustomOption(customElement),
            ...bindingOptions,
          ])
        : customElement;

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

const createCustomOption = (element: HTMLElement) => ({
  id: "custom",
  display: "Custom",
  element,
});

const createAttributeBufferComponent = (
  attributeBufferInfo: AttributeBufferInfo
) => {
  switch (attributeBufferInfo.getAttributeBufferType()) {
    case AttributeBufferType.FLOAT_VEC3:
      return createAttributeBufferInputVec3(value => {
        attributeBufferInfo.setValue(value);
      });
    case AttributeBufferType.FLOAT_VEC4:
      const initialValue: Vector4[] = [
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
      ];
      attributeBufferInfo.setValue(initialValue);
      return createAttributeBufferInputVec4(initialValue, value => {
        attributeBufferInfo.setValue(value);
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

//vec3
//binding

const createBindingOptions = (
  update: (newValue: any) => void,
  attributeBufferBindings: AttributeBufferBinding[],
  previewElementFactory: () => HTMLElement
): [{ id: string; display: string; element: HTMLElement }[], Unsubscribe] => {
  const xx = attributeBufferBindings.map(b => {
    const unsub = b.subscribeToChange(update);
    const element = previewElementFactory();
    const display = b.name;

    return {
      id: "dupa",
      unsub,
      element,
      display,
    };
  });

  const unsub = () => xx.forEach(x => x.unsub());
  return [xx, unsub];
};

const createAttributeBufferInputVec3 = (update: (value: Vector3[]) => void) => {
  const input = document.createElement("input");
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

  // if (attributeBufferBindings.length) {
  //   //attributeBufferBindings.map(b => b.)
  //   //preview element
  //   const unsub = attributeBufferBindings[9].subscribeToChange(update);
  //   const bind = {
  //     display: "Bind - ",
  //   };
  //   //const { bindingOptions, unsubscribe } =
  //   const optionsElement = createElementsDropdown({
  //     custom: {
  //       display: "Custom",
  //       element: input,
  //     },
  //   });
  // }

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
