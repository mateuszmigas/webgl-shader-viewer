import { uuidv4 } from "../../../../common/uuid";
import {
  createCustomElementOption,
  createElementsDropdown,
} from "./../../components/dropdown";
import { CompositeKeyMap } from "../../utils/compositeKeyMap";
import { Vector3, Vector4 } from "../../components/inputNumber";
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

export const getDefaultValue = (type: AttributeBufferType) => {
  return [
    [0, 0, 0, 1],
    [0, 0.5, 0, 1],
    [0.9, 0, 0, 1],
    [0, 0.5, 0, 1],
    [0.7, 0, 0, 1],
    [0.7, 0.5, 0, 1],
  ];
};

export type AttributeBufferBinding = {
  name: string;
  type: AttributeBufferType;
  value: Observable<any>;
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

      const applicableBindings = attributeBufferBindings.filter(
        b => b.type === attributeBufferInfo.getAttributeBufferType()
      );

      const { element, dispose } = applicableBindings.length
        ? createDropdownWithBindings(attributeBufferInfo, applicableBindings)
        : createSingle(attributeBufferInfo);

      return {
        key,
        value: {
          component: withLabel(element, attributeBuffer.name),
          attributeBufferInfo,
          dispose: () => {
            attributeBufferInfo.deleteBuffer();
            dispose?.();
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
  currentValue: Observable<any>
) => {
  switch (attributeBufferType) {
    case AttributeBufferType.FLOAT_VEC4:
      return createAttributeBufferInputVec4(currentValue, editable);
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

export const createSingle = (attributeBufferInfo: AttributeBufferInfo) => {
  const customValue = new Observable<any>(
    getDefaultValue(attributeBufferInfo.getAttributeBufferType())
  );
  customValue.attach((value: any) => {
    attributeBufferInfo.setValue(value);
  });

  const element = createAttributeBufferComponent(
    attributeBufferInfo.getAttributeBufferType(),
    true,
    customValue
  );

  return { element, dispose: () => customValue.detachAll() };
};

export const createDropdownWithBindings = (
  attributeBufferInfo: AttributeBufferInfo,
  attributeBufferBindings: AttributeBufferBinding[]
) => {
  const options = attributeBufferBindings.map(binding => {
    const element = createAttributeBufferComponent(
      attributeBufferInfo.getAttributeBufferType(),
      false,
      binding.value
    );

    return {
      id: uuidv4(),
      element,
      display: binding.name,
      value: binding.value,
    };
  });

  const customValue = new Observable<any>(
    getDefaultValue(attributeBufferInfo.getAttributeBufferType())
  );
  customValue.attach((value: any) => attributeBufferInfo.setValue(value));

  let customElement = createAttributeBufferComponent(
    attributeBufferInfo.getAttributeBufferType(),
    true,
    customValue
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
          customValue.forceNotify();
        }
      }
    ),
    customElement,
    ...options.map(o => o.element),
  ]);

  return {
    element,
    dispose: () => {
      detach?.();
      customValue.detachAll();
    },
  };
};

const createAttributeBufferInputVec4 = (
  value: Observable<Vector4>,
  editable: boolean
) => {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.disabled = !editable;

  if (!editable) {
    const listener = (value: Vector4) => (input.value = JSON.stringify(value));
    value.attach(listener);
  }

  input.value = JSON.stringify(value.getValue());
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
      value.setValue(result);
    } catch (error) {
      console.log("this is not a json");
    }
  };

  //Wrong format! Should be [[x1,y1], [x2,y2], ...]
  return input;
};
