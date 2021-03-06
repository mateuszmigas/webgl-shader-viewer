import { imageExtensions } from "./../../constants";
import {
  createObservableElement,
  createSelectionComponent,
  createTextInput,
} from "./common";
import { withLabel } from "../../components/wrappers";
import { CompositeKeyMap } from "../compositeKeyMap";
import { TextureInfo } from "./texture";
import { loadImage } from "../image";
import { viewerEndpoint } from "../../../../common/communication/viewerEndpoint";
import { Observable } from "../observable";

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

      const updateUrl = (value: string | { type: string; value: string }) => {
        console.log("update", value);

        if (typeof value === "string") {
          loadImage(value).then(img => textureInfo.setSource(img));
        } else {
          if (value.type === "vscode-webview-resource") {
            viewerEndpoint.getExtensionFileUri(value.value).then(x => {
              loadImage(x).then(img => textureInfo.setSource(img));
            });
          }
        }
      };

      viewerEndpoint.getWorkspaceFilesOfTypes(imageExtensions).then(x => {
        console.log(x);
      });

      const { element, dispose } = createSelectionComponent(
        [
          createCustomOption(),
          createLocalImageOption("texture1.jpg") as any,
          createLocalImageOption("texture2.jpg") as any,
        ],
        updateUrl
      );

      return {
        key,
        value: {
          component: withLabel(element, texture.name),
          textureInfo,
          dispose: () => {
            textureInfo.deleteTexture();
            dispose?.();
          },
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(c => c.value);
};

const createCustomOption = () => {
  return {
    id: "custom",
    display: "Custom",
    ...createObservableElement(
      value => createTextInput(value, false),
      "https://i.imgur.com/vXDWqIH.jpeg"
    ),
  };
};

const createLocalImageOption = (fileName: string) => {
  return {
    id: fileName,
    display: fileName,
    value: new Observable<{ type: string; value: string }>({
      type: "vscode-webview-resource",
      value: fileName,
    }),
    element: document.createElement("div"),
  };
};
