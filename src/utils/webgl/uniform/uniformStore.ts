import { CompositeKeyMap } from "@utils/compositeKeyMap";
import { UniformInfo, UniformType } from "./uniform";

type CacheKey = {
  name: string;
  type: UniformType;
};

type CacheValue = {
  uniformInfo: UniformInfo;
};

const keySelector = (key: CacheKey): string => `${key.name};${key.type}`;
const cache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newElements: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newElements.map(v => keySelector(v.key));
  const elementsToRemove = cache.entriesStrKey().filter(e => !newValuesStrKeys.includes(e[0]));

  elementsToRemove.forEach(c => cache.deleteStrKey(c[0]));

  newElements.forEach(e => {
    if (!cache.has(e.key)) cache.set(e.key, e.value);
  });
};

export const getUniformInfo = (name: string, type: UniformType) => cache.get({ name, type });

export const getOrCreateUniformInfos = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  uniforms: { name: string; type: UniformType }[]
) => {
  const elements = uniforms.map(uniform => {
    const key = {
      ...uniform,
    };

    const valueFromCache = cache.get(key);

    if (valueFromCache) {
      valueFromCache.uniformInfo.attachToProgram(program);
      return { key, value: valueFromCache };
    } else {
      const uniformInfo = new UniformInfo(context, program, uniform.name, uniform.type);

      return {
        key,
        value: {
          uniformInfo,
        },
      };
    }
  });

  rebuildCache(elements);
  return elements.map(uc => uc.value.uniformInfo);
};
