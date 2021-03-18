import { store } from "../..";
import { ViewerState } from "../../store/state";
import { debounce } from "../function";
import { safeJSONParse } from "../parsing";
import { getAttributeBufferInfo } from "./attributeBufferStore";
import { getUniformInfo } from "./uniformStore";

export const setWebGLFromState = () => {
  const state = store.getState();

  Object.entries(state.attributeBufferValues).forEach(([key, value]) => {
    getAttributeBufferInfo(key, value.type)?.attributeBufferInfo.setValue(
      safeJSONParse(value.value) ?? []
    );
  });

  Object.entries(state.uniformValues).forEach(([key, value]) => {
    getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value);
  });

  Object.entries(state.textureValues).forEach(([key, value]) => {
    //getTextureInfo(key)?.textureInfo.setValue(value.value);
  });
};

let lastCommitedState: ViewerState = undefined;
export const commitStateToWebGL = debounce((state: ViewerState) => {
  if (lastCommitedState?.attributeBufferValues !== state.attributeBufferValues) {
    Object.entries(state.attributeBufferValues).forEach(([key, value]) => {
      if (lastCommitedState?.attributeBufferValues[key] !== value) {
        getAttributeBufferInfo(key, value.type)?.attributeBufferInfo.setValue(
          safeJSONParse(value.value) ?? []
        );
      }
    });
  }

  if (lastCommitedState?.uniformValues !== state.uniformValues) {
    Object.entries(state.uniformValues).forEach(([key, value]) => {
      if (lastCommitedState?.uniformValues[key] !== value) {
        getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value);
      }
    });
  }

  if (lastCommitedState?.textureValues !== state.textureValues) {
    Object.entries(state.textureValues).forEach(([key, value]) => {
      if (lastCommitedState?.textureValues[key] !== value) {
        //getUniformInfo(key, value.type)?.uniformInfo.setValue(value.value);
      }
    });
  }

  lastCommitedState = state;
}, 100);
