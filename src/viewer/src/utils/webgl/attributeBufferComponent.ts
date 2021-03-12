import { Observable } from "./../observable";
import { CompositeKeyMap } from "../../utils/compositeKeyMap";
import { AttributeBufferInfo, AttributeBufferType } from "./attributeBuffer";

type CacheKey = {
  name: string;
  type: AttributeBufferType;
};

type CacheValue = {
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

const getDefaultValue = (type: AttributeBufferType) => {
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

export const getByName = (name: string, type: AttributeBufferType) =>
  componentCache.get({ name, type });

export const getFromCacheOrCreate = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  attributeBuffers: { name: string; type: AttributeBufferType }[]
): AttributeBufferInfo[] => {
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

      return {
        key,
        value: {
          attributeBufferInfo,
          dispose: () => attributeBufferInfo.deleteBuffer(),
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(c => c.value.attributeBufferInfo);
};

// const createCustomOption = (attributeBufferInfo: AttributeBufferInfo) => {
//   return {
//     id: "custom",
//     display: "Custom",
//     ...createEditableComponent(attributeBufferInfo),
//   };
// };

// const createBindingOptions = (
//   attributeBufferBindings: AttributeBufferBinding[],
//   attributeBufferInfo: AttributeBufferInfo
// ) => {
//   return attributeBufferBindings.map(binding => {
//     const element = createElementForType(
//       attributeBufferInfo.getAttributeBufferType(),
//       false,
//       binding.value
//     );

//     return {
//       id: uuidv4(),
//       element,
//       display: binding.name,
//       value: binding.value,
//     };
//   });
// };

// const createEditableComponent = (
//   attributeBufferInfo: AttributeBufferInfo,
//   onChange?: (value: any) => void
// ) => {
//   const initialValue = getDefaultValue(attributeBufferInfo.getAttributeBufferType());
//   const customValue = new Observable<any>(initialValue);

//   if (onChange) {
//     customValue.attach((value: any) => onChange(value));
//     onChange(initialValue);
//   }

//   const element = createElementForType(
//     attributeBufferInfo.getAttributeBufferType(),
//     true,
//     customValue
//   );

//   return {
//     element,
//     value: customValue,
//     dispose: () => customValue.detachAll(),
//   };
// };

// const createElementForType = (
//   attributeBufferType: AttributeBufferType,
//   editable: boolean,
//   currentValue: Observable<any>
// ) => {
//   switch (attributeBufferType) {
//     case AttributeBufferType.FLOAT_VEC2:
//       return createElementArray(2, currentValue, editable);
//     case AttributeBufferType.FLOAT_VEC3:
//       return createElementArray(3, currentValue, editable);
//     case AttributeBufferType.FLOAT_VEC4:
//       return createElementArray(4, currentValue, editable);
//     default:
//       return createElementNotSupported();
//   }
// };
