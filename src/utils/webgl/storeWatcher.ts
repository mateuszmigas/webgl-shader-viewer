import { store } from "../../viewer";
import { ViewerState } from "@viewerStore/state";
import { debounce } from "../function";
import { safeJSONParse } from "../parsing";
import { getAttributeBufferInfo } from "./attributeBufferStore";
import { getIndexBufferInfo } from "./indexBufferStore";
import { getUniformInfo } from "./uniformStore";
import { loadTextureForState } from "../../viewer/components/texture/texturesUtils";

const getBufferValueOrDefault = (storeValue: { value: string; error: string }) =>
  !storeValue.error ? safeJSONParse(storeValue.value) ?? [] : [];

export const setWebGLFromState = () => {
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
      loadTextureForState(key, value.optionId, value.value)
    );
};

let lastCommitedAttributeBuffersState: ViewerState["attributeBufferValues"] = undefined;
export const setAttributeBuffers = debounce(
  (attributeBufferValues: ViewerState["attributeBufferValues"]) => {
    if (
      lastCommitedAttributeBuffersState !== attributeBufferValues &&
      lastCommitedAttributeBuffersState &&
      attributeBufferValues
    ) {
      Object.entries(attributeBufferValues).forEach(([key, value]) => {
        if (lastCommitedAttributeBuffersState[key] !== value) {
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
export const setIndexBuffer = debounce((indexBufferValue: ViewerState["indexBufferValue"]) => {
  if (
    lastCommitedIndexBufferState !== indexBufferValue &&
    lastCommitedIndexBufferState &&
    indexBufferValue
  ) {
    getIndexBufferInfo()?.setValue(getBufferValueOrDefault(indexBufferValue));
  }

  lastCommitedIndexBufferState = indexBufferValue;
}, 100);

let lastCommitedUniformsState: ViewerState["uniformValues"] = undefined;
export const setUniforms = (uniformValues: ViewerState["uniformValues"]) => {
  if (lastCommitedUniformsState !== uniformValues && lastCommitedUniformsState && uniformValues) {
    Object.entries(uniformValues).forEach(([key, value]) => {
      if (lastCommitedUniformsState[key] !== value) {
        getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value);
      }
    });
  }
  lastCommitedUniformsState = uniformValues;
};

let lastCommitedTexturesState: ViewerState["textureValues"] = undefined;
export const setTextures = debounce((textureValues: ViewerState["textureValues"]) => {
  if (lastCommitedTexturesState !== textureValues && lastCommitedTexturesState && textureValues) {
    Object.entries(textureValues).forEach(([key, value]) => {
      if (lastCommitedTexturesState[key] !== value) {
        loadTextureForState(key, value.optionId, value.value);
      }
    });
  }

  lastCommitedTexturesState = textureValues;
}, 200);
