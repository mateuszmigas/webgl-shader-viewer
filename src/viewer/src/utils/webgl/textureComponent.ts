import { withLabel } from "../../components/wrappers";
import { CompositeKeyMap } from "../compositeKeyMap";
import { TextureInfo } from "./texture";

type CacheKey = {
  name: string;
};

type CacheValue = {
  component: HTMLElement;
  textureInfo: TextureInfo;
  dispose: () => void;
};

const keySelector = (key: CacheKey): string => key.name;
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

export const createTextureComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  textures: { name: string }[]
) => {
  const components = textures.map((texture, index) => {
    const key = {
      ...texture,
    };

    const fromCache = componentCache.get(key);

    if (fromCache) {
      fromCache.textureInfo.attachToProgram(program);
      fromCache.textureInfo.setUnit(index);
      return { key, value: fromCache };
    } else {
      const textureInfo = new TextureInfo(
        context,
        program,
        texture.name,
        index
      );

      const element = createElementUrl(
        "https://i.imgur.com/vXDWqIH.jpeg",
        url => textureInfo.setUrl(url)
      );

      return {
        key,
        value: {
          component: withLabel(element, texture.name),
          textureInfo,
          dispose: () => {
            textureInfo.deleteTexture();
            //dispose?.();
          },
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(c => c.value);
};

export const createElementUrl = (
  initialValue: string,
  onChange: (newValue: string) => void
) => {
  const input = document.createElement("input");
  input.className = "edit-input";
  input.value = initialValue;
  input.onblur = () => {
    onChange(input.value);
  };
  onChange(initialValue);

  return input;
};