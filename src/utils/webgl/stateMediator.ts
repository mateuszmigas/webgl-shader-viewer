import { getTextureBinding } from "./texture/textureUtils";
import { ViewerState } from "@viewerStore/state";
import { debounce } from "../function";
import { safeJSONParse } from "../parsing";
import { viewerEndpoint } from "@communication/viewerEndpoint";
import { loadImage } from "@utils/image";
import { translations } from "@common/translations";
import { anyPropChanged } from "@utils/object";
import { store } from "viewer";
import { getAttributeBufferInfo } from "./attributeBuffer/attributeBufferStore";
import { getIndexBufferInfo } from "./indexBuffer/indexBufferStore";
import { getTextureInfo } from "./texture/textureStore";
import { getUniformInfo } from "./uniform/uniformStore";

export const commitStateOnInit = () => {
  const state = store.getState();
  state.attributeBufferValues &&
    Object.entries(state.attributeBufferValues).forEach(([key, value]) =>
      getAttributeBufferInfo(key, value.type)?.attributeBufferInfo.setValue(
        getBufferValueOrDefault(value)
      )
    );

  state.indexBufferValue &&
    getIndexBufferInfo().setValue(getBufferValueOrDefault(state.indexBufferValue));

  state.uniformValues &&
    Object.entries(state.uniformValues).forEach(([key, value]) =>
      getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value)
    );

  state.textureValues &&
    Object.entries(state.textureValues).forEach(([key, value]) =>
      setTexture(key, value.optionId, value.value)
    );
};

export const commitStateOnChange = (state: ViewerState) => {
  setAttributeBuffers(state.attributeBufferValues);
  setIndexBuffer(state.indexBufferValue);
  setUniforms(state.uniformValues);
  setTextures(state.textureValues);
};

const setTexture = async (name: string, optionId: string, value: string): Promise<string> => {
  const textureInfo = getTextureInfo(name)?.textureInfo;

  if (!textureInfo) {
    return;
  }

  const binding = getTextureBinding(optionId);
  const uri = binding ? await viewerEndpoint.getExtensionFileUri(binding.fileName) : value;
  const setError = (error: string) => {
    store.dispatch({
      type: "SET_TEXTURE_LOADING_ERROR",
      payload: { name, error },
    });
    error && textureInfo.setPlaceholderTexture();
  };

  if (!uri) {
    setError(translations.errors.emptyUrl);
  } else {
    try {
      const img = await loadImage(uri);
      textureInfo.setSource(img);
      setError("");
    } catch {
      setError(translations.errors.fetchingImage);
    }
  }
};

const getBufferValueOrDefault = (storeValue: { value: string; error: string }) =>
  !storeValue.error ? safeJSONParse(storeValue.value) ?? [] : [];

let lastCommitedAttributeBuffersState: ViewerState["attributeBufferValues"] = undefined;
const setAttributeBuffers = debounce(
  (attributeBufferValues: ViewerState["attributeBufferValues"]) => {
    if (
      lastCommitedAttributeBuffersState !== attributeBufferValues &&
      lastCommitedAttributeBuffersState &&
      attributeBufferValues
    ) {
      Object.entries(attributeBufferValues).forEach(([key, value]) => {
        if (anyPropChanged(lastCommitedAttributeBuffersState[key], value, ["value", "optionId"])) {
          getAttributeBufferInfo(key, value.type)?.attributeBufferInfo.setValue(
            getBufferValueOrDefault(value)
          );
        }
      });
    }

    lastCommitedAttributeBuffersState = attributeBufferValues;
  },
  100
);

let lastCommitedIndexBufferState: ViewerState["indexBufferValue"] = undefined;
const setIndexBuffer = debounce((indexBufferValue: ViewerState["indexBufferValue"]) => {
  if (
    lastCommitedIndexBufferState &&
    anyPropChanged(lastCommitedIndexBufferState, indexBufferValue, ["value", "optionId"]) &&
    indexBufferValue
  ) {
    getIndexBufferInfo()?.setValue(getBufferValueOrDefault(indexBufferValue));
  }

  lastCommitedIndexBufferState = indexBufferValue;
}, 100);

let lastCommitedUniformsState: ViewerState["uniformValues"] = undefined;
const setUniforms = (uniformValues: ViewerState["uniformValues"]) => {
  if (lastCommitedUniformsState !== uniformValues && lastCommitedUniformsState && uniformValues) {
    Object.entries(uniformValues).forEach(([key, value]) => {
      if (anyPropChanged(lastCommitedUniformsState[key], value, ["value", "optionId"])) {
        getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value);
      }
    });
  }
  lastCommitedUniformsState = uniformValues;
};

let lastCommitedTexturesState: ViewerState["textureValues"] = undefined;
const setTextures = debounce((textureValues: ViewerState["textureValues"]) => {
  if (lastCommitedTexturesState !== textureValues && lastCommitedTexturesState && textureValues) {
    Object.entries(textureValues).forEach(([key, value]) => {
      if (anyPropChanged(lastCommitedTexturesState[key], value, ["optionId", "value"])) {
        setTexture(key, value.optionId, value.value);
      }
    });
  }
  lastCommitedTexturesState = textureValues;
}, 200);
