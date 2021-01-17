import { uuidv4 } from "../../../../common/uuid";
import {
  createCustomElementOption,
  createElementsDropdown,
} from "./../../components/dropdown";
import { CompositeKeyMap } from "../../utils/compositeKeyMap";
import { Unsubscribe, foo } from "../../../../common/types";
import { Vector2, Vector3, Vector4 } from "../../components/inputNumber";
import { createDiv, withLabel } from "../../components/wrappers";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";

type CacheKey = {
  name: string;
  type: AttributeBufferType;
};

type CacheValue = {
  component: HTMLElement;
  attributeBufferInfo: AttributeBufferInfo;
  dispose: () => void;
};

const keySelector = (key: CacheKey): string => `${key.name};${key.type}`;
const componentCache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newValues: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newValues.map(v => keySelector(v.key));
  const componentsToRemove = componentCache
    .entriesStrKey()
    .filter(e => !newValuesStrKeys.includes(e[0]));

  componentsToRemove.forEach(c => {
    c[1].dispose();
    componentCache.deleteStrKey(c[0]);
  });

  newValues.forEach(nw => {
    if (!componentCache.has(nw.key)) componentCache.set(nw.key, nw.value);
  });
};

export type AttributeBufferBinding = {
  name: string;
  type: AttributeBufferType;
  subscribeToChange: (newValue: any) => Unsubscribe;
};

export const createAttributeBufferComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  attributeBuffers: { name: string; type: AttributeBufferType }[],
  attributeBufferBindings: AttributeBufferBinding[]
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

      const customElement = createAttributeBufferComponent(
        attributeBufferInfo,
        true
      );

      const { options, unsubscribe } = createBindingOptions(
        attributeBufferInfo,
        attributeBufferBindings.filter(
          b => b.type === attributeBufferInfo.getAttributeBufferType()
        ),
        () => createAttributeBufferComponent(attributeBufferInfo, false)
      );

      const element = options.length
        ? createDiv("column-with-gap", [
            createElementsDropdown([
              createCustomElementOption(customElement),
              ...options,
            ]),
            customElement,
            ...options.map(o => o.element),
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

const createAttributeBufferComponent = (
  attributeBufferInfo: AttributeBufferInfo,
  editable: boolean
) => {
  switch (attributeBufferInfo.getAttributeBufferType()) {
    case AttributeBufferType.FLOAT_VEC3:
      return createAttributeBufferInputVec3(value => {
        attributeBufferInfo.setValue(value);
      }, editable);
    case AttributeBufferType.FLOAT_VEC4:
      const initialValue: Vector4[] = [
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
      ];
      attributeBufferInfo.setValue(initialValue);
      return createAttributeBufferInputVec4(
        initialValue,
        value => {
          attributeBufferInfo.setValue(value);
        },
        editable
      );
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

const createBindingOptions = (
  attributeBufferInfo: AttributeBufferInfo,
  attributeBufferBindings: AttributeBufferBinding[],
  previewElementFactory: () => HTMLElement
): {
  options: { id: string; display: string; element: HTMLElement }[];
  unsubscribe: Unsubscribe;
} => {
  const options = attributeBufferBindings.map(binding => {
    const element = previewElementFactory();
    const unsubscribe = binding.subscribeToChange((value: any) => {
      attributeBufferInfo.setValue(value);
    });

    return {
      id: uuidv4(),
      unsubscribe,
      element,
      display: binding.name,
    };
  });

  const unsubscribeAll = () => options.forEach(x => x.unsubscribe());
  return { options, unsubscribe: unsubscribeAll };
};

const createAttributeBufferInputVec3 = (
  update: (value: Vector3[]) => void,
  editable: boolean
) => {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.disabled = !editable;
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
  update: (value: Vector4[]) => void,
  editable: boolean
) => {
  const input = document.createElement("input");
  //const itemElement = { element: input, value };
  //Object.assign(input, inputOptions);
  input.className = "edit-input";
  input.disabled = !editable;
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
