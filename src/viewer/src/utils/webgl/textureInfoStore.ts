import { CompositeKeyMap } from "../compositeKeyMap";
import { TextureInfo } from "./textureInfo";

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
    if (!cache.has(nw.key)) cache.set(nw.key, nw.value);
  });
};

export const getTextureInfo = (name: string) => cache.get({ name });

export const createTextureInfos = (
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

      // const updateUrl = (value: string | { type: ImageType; value: string }) => {
      //   if (typeof value === "string") {
      //     loadImage(value).then(img => textureInfo.setSource(img));
      //   } else {
      //     if (value.type === "extension-image") {
      //       viewerEndpoint.getExtensionFileUri(value.value).then(x => {
      //         loadImage(x).then(img => textureInfo.setSource(img));
      //       });
      //     }
      //   }
      // };

      // viewerEndpoint.getWorkspaceFilesOfTypes(imageExtensions).then(x => {
      //   console.log(x);
      // });

      // const { element, dispose } = createSelectionComponent(
      //   [createCustomOption(), ...extensionTextures.map(createLocalImageOption)],
      //   updateUrl
      // );

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
  return elements.map(c => c.value);
};
