import { CompositeKeyMap } from "@utils/compositeKeyMap";
import { TextureInfo } from "./texture";

type CacheKey = {
  name: string;
};

type CacheValue = {
  textureInfo: TextureInfo;
  dispose: () => void;
};

const keySelector = (key: CacheKey): string => key.name;
const cache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newElements: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newElements.map(v => keySelector(v.key));
  const elementsToRemove = cache.entriesStrKey().filter(e => !newValuesStrKeys.includes(e[0]));

  elementsToRemove.forEach(c => {
    c[1].dispose();
    cache.deleteStrKey(c[0]);
  });

  newElements.forEach(nw => {
    if (!cache.has(nw.key)) {
      cache.set(nw.key, nw.value);
    }
  });
};

export const getTextureInfo = (name: string) => cache.get({ name });

export const getOrCreateTextureInfos = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  textures: { name: string }[]
) => {
  const elements = textures.map((texture, index) => {
    const key = {
      ...texture,
    };

    const valueFromCache = cache.get(key);

    if (valueFromCache) {
      valueFromCache.textureInfo.attachToProgram(program);
      valueFromCache.textureInfo.setUnit(index);
      return { key, value: valueFromCache };
    } else {
      const textureInfo = new TextureInfo(context, program, texture.name, index);

      return {
        key,
        value: {
          textureInfo,
          dispose: () => {
            textureInfo.deleteTexture();
          },
        },
      };
    }
  });

  rebuildCache(elements);
  return elements.map(c => c.value.textureInfo);
};
