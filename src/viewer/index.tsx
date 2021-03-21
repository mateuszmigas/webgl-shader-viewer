import React from "react";
import ReactDOM from "react-dom";
import { ExtensionState, setExtensionState } from "@extensionState";
import { createStore, Store } from "redux";
import { Provider } from "react-redux";
import { ViewerAction } from "@viewerStore/actions";
import { ViewerState } from "@viewerStore/state";
import { Viewer } from "./components/Viewer";
import { debounce } from "@utils/function";
import {
  setAttributeBuffers,
  setIndexBuffer,
  setTextures,
  setUniforms,
} from "../utils/webgl/storeWatcher";
import { reducer } from "@viewerStore/reducer";

export const store: Store<ViewerState, ViewerAction> = createStore(reducer);

const storeExtensionState = debounce((extensionState: ExtensionState) => {
  setExtensionState(extensionState);
}, 500);

store.subscribe(() => {
  const currentState = store.getState();
  storeExtensionState(currentState);
  setAttributeBuffers(currentState.attributeBufferValues);
  setIndexBuffer(currentState.indexBufferValue);
  setUniforms(currentState.uniformValues);
  setTextures(currentState.textureValues);
});

ReactDOM.render(
  <Provider store={store}>
    <Viewer />
  </Provider>,
  document.getElementById("viewer")
);
