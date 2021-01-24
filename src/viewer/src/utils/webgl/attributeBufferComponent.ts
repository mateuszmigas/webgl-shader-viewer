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
import { Observable } from "../observable";

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
  value: Observable<any>;
  //subscribeToChangeWithLatest: (newValue: any) => Unsubscribe;
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

      //const onChange = ()
      const customElement = createAttributeBufferComponent(
        attributeBufferInfo.getAttributeBufferType(),
        true,
        value => attributeBufferInfo.setValue(value)
      );

      const applicableBindings = attributeBufferBindings.filter(
        b => b.type === attributeBufferInfo.getAttributeBufferType()
      );

      const { element, unsubscribe } = applicableBindings.length
        ? createDropdownWithBindings(attributeBufferInfo, applicableBindings)
        : {
            element: customElement,
            unsubscribe: undefined,
          };

      return {
        key,
        value: {
          component: withLabel(element, attributeBuffer.name),
          attributeBufferInfo,
          dispose: () => {
            attributeBufferInfo.deleteBuffer();
            unsubscribe?.();
          },
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(c => c.value);
};

const createAttributeBufferComponent = (
  attributeBufferType: AttributeBufferType,
  editable: boolean,
  onUpdate: (value: any) => void
) => {
  switch (attributeBufferType) {
    case AttributeBufferType.FLOAT_VEC3:
      return createAttributeBufferInputVec3(onUpdate, editable);
    case AttributeBufferType.FLOAT_VEC4:
      const initialValue: Vector4[] = [
        [0, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.9, 0, 0, 1],
        [0, 0.5, 0, 1],
        [0.7, 0, 0, 1],
        [0.7, 0.5, 0, 1],
      ];
      onUpdate(initialValue);
      return createAttributeBufferInputVec4(initialValue, onUpdate, editable);
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

export const createDropdownWithBindings = (
  attributeBufferInfo: AttributeBufferInfo,
  attributeBufferBindings: AttributeBufferBinding[]
) => {
  const options = attributeBufferBindings.map(binding => {
    const element = createAttributeBufferComponent(
      attributeBufferInfo.getAttributeBufferType(),
      false,
      value => attributeBufferInfo.setValue(value)
    );

    return {
      id: uuidv4(),
      element,
      display: binding.name,
      value: binding.value,
    };
  });

  let lastCustomValue: any = null;
  let customElement = createAttributeBufferComponent(
    attributeBufferInfo.getAttributeBufferType(),
    false,
    value => {
      lastCustomValue = value;
      attributeBufferInfo.setValue(value);
    }
  );

  let detach: () => void = undefined;
  const element = createDiv("column-with-gap", [
    createElementsDropdown(
      [createCustomElementOption(customElement), ...options],
      id => {
        detach?.();

        const option = options.find(o => o.id === id);
        if (option) {
          const callback = (value: any) => attributeBufferInfo.setValue(value);
          option.value.attach(callback);
          callback(option.value.getValue());
          detach = () => option.value.detach(callback);
        } else {
          attributeBufferInfo.setValue(lastCustomValue);
        }
      }
    ),
    customElement,
    ...options.map(o => o.element),
  ]);

  return { element, unsubscribe: () => detach() };
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
  let currentValue = initialValue;
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
      currentValue = result;
      update(result);
    } catch (error) {
      console.log("this is not a json");
    }
  };
  //Wrong format! Should be [[x1,y1], [x2,y2], ...]
  return input;
};
