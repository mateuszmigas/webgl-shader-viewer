import { defaultTextureUrl, extensionTextures, imageExtensions } from "../../constants";
import { CompositeKeyMap } from "../compositeKeyMap";
import { TextureInfo } from "./textureInfo";
import { loadImage } from "../image";
import { viewerEndpoint } from "../../../../common/communication/viewerEndpoint";
import { Observable } from "../observable";

type ImageType = "extension-image";

type CacheKey = {
  name: string;
};

type CacheValue = {
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

export const getTextureInfos = (
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

      viewerEndpoint.getWorkspaceFilesOfTypes(imageExtensions).then(x => {
        console.log(x);
      });

      // const { element, dispose } = createSelectionComponent(
      //   [createCustomOption(), ...extensionTextures.map(createLocalImageOption)],
      //   updateUrl
      // );

      return {
        key,
        value: {
          //component: withLabel(element, texture.name),
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

// const createCustomOption = () => {
//   return {
//     id: "custom",
//     display: "Custom",
//     ...createObservableElement(
//       value => createTextInput(value, false),
//       defaultTextureUrl
//     ),
//   };
// };

// const createLocalImageOption = (fileName: string) => {
//   return {
//     id: fileName,
//     display: fileName,
//     value: new Observable<{ type: ImageType; value: string }>({
//       type: "extension-image",
//       value: fileName,
//     }),
//     element: document.createElement("div"),
//   };
// };