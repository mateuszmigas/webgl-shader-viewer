import { Observable } from "./../observable";
import { uuidv4 } from "../../../../common/uuid";
import { createElementsDropdown } from "./../../components/dropdown";
import { CompositeKeyMap } from "../../utils/compositeKeyMap";
import { createDiv, withLabel } from "../../components/wrappers";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";
import { Vector4Array } from "../../types";

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

      const updateBuffer = (value: number[][]) =>
        attributeBufferInfo.setValue(value);

      const { element, dispose } = applicableBindings.length
        ? createSelectionComponent(
            [
              createCustomOption(attributeBufferInfo),
              ...createBindingOptions(applicableBindings, attributeBufferInfo),
            ],
            updateBuffer
          )
        : createEditableComponent(attributeBufferInfo, updateBuffer);

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

const createCustomOption = (attributeBufferInfo: AttributeBufferInfo) => {
  return {
    id: "custom",
    display: "Custom",
    ...createEditableComponent(attributeBufferInfo),
  };
};

const createBindingOptions = (
  attributeBufferBindings: AttributeBufferBinding[],
  attributeBufferInfo: AttributeBufferInfo
) => {
  return attributeBufferBindings.map(binding => {
    const element = createElementForType(
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
};

const createSelectionComponent = (
  options: {
    id: string;
    display: string;
    value: Observable<any>;
    element: HTMLElement;
  }[],
  onChange: (value: any) => void
) => {
  let detach: () => void = null;
  const element = createDiv("column-with-gap", [
    createElementsDropdown(options, id => {
      detach?.();
      const option = options.find(o => o.id === id);
      const callback = (value: any) => onChange(value);
      option.value.attach(callback);
      callback(option.value.getValue());
      detach = () => option.value.detach(callback);
    }),
    ...options.map(o => o.element),
  ]);

  return {
    element,
    dispose: () => detach?.(),
  };
};

const createEditableComponent = (
  attributeBufferInfo: AttributeBufferInfo,
  onChange?: (value: any) => void
) => {
  const customValue = new Observable<any>(
    getDefaultValue(attributeBufferInfo.getAttributeBufferType())
  );

  if (onChange)
    customValue.attach((value: any) => {
      attributeBufferInfo.setValue(value);
    });

  const element = createElementForType(
    attributeBufferInfo.getAttributeBufferType(),
    true,
    customValue
  );

  return {
    element,
    value: customValue,
    dispose: () => customValue.detachAll(),
  };
};

const createElementForType = (
  attributeBufferType: AttributeBufferType,
  editable: boolean,
  currentValue: Observable<any>
) => {
  switch (attributeBufferType) {
    case AttributeBufferType.FLOAT_VEC4:
      return createElementVec4(currentValue, editable);
    default:
      return createElementNotSupported();
  }
};

const createElementNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported attribute buffer";
  return div;
};

const createElementVec4 = (
  value: Observable<Vector4Array>,
  editable: boolean
) => {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.disabled = !editable;

  if (!editable) {
    const listener = (value: Vector4Array) =>
      (input.value = JSON.stringify(value));
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
