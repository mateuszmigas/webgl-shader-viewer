import { CompositeKeyMap } from "../compositeKeyMap";
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
const cache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newElements: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newElements.map(v => keySelector(v.key));
  const elementsToRemove = cache.entriesStrKey().filter(e => !newValuesStrKeys.includes(e[0]));

  elementsToRemove.forEach(c => {
    c[1].dispose();
    cache.deleteStrKey(c[0]);
  });

  newElements.forEach(e => {
    if (!cache.has(e.key)) cache.set(e.key, e.value);
  });
};

export const getByName = (name: string, type: AttributeBufferType) => cache.get({ name, type });

export const getFromCacheOrCreate = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  attributeBuffers: { name: string; type: AttributeBufferType }[]
): AttributeBufferInfo[] => {
  const elements = attributeBuffers.map(attributeBuffer => {
    const key = {
      ...attributeBuffer,
    };

    const valueFromCache = cache.get(key);

    if (valueFromCache) {
      valueFromCache.attributeBufferInfo.attachToProgram(program);
      return { key, value: valueFromCache };
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

  rebuildCache(elements);
  return elements.map(c => c.value.attributeBufferInfo);
};
