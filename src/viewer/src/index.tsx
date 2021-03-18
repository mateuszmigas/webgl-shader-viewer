import React from "react";
import ReactDOM from "react-dom";
import { ExtensionState, setExtensionState } from "../../common/extensionState";
import { createStore, Store } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./store/reducer";
import { ViewerAction } from "./store/actions";
import { ViewerState } from "./store/state";
import { Viewer } from "./components/Viewer";
import { debounce } from "./utils/function";
import { setAttributeBuffers, setTextures, setUniforms } from "./utils/webgl/storeWatcher";

export const store: Store<ViewerState, ViewerAction> = createStore(
  (state: ViewerState, action: ViewerAction) => {
    //console.log("state before", state);
    //console.log("action", action);
    const newLocal = reducer(state, action);
    //console.log("state after", newLocal);
    return newLocal;
  }
);

const storeExtensionState = debounce((extensionState: ExtensionState) => {
  setExtensionState(extensionState);
}, 500);

store.subscribe(() => {
  const currentState = store.getState();
  const { counter, ...extensionState } = currentState;
  storeExtensionState(extensionState);
  setAttributeBuffers(currentState.attributeBufferValues);
  setUniforms(currentState.uniformValues);
  setTextures(currentState.textureValues);
});

ReactDOM.render(
  <Provider store={store}>
    <Viewer />
  </Provider>,
  document.getElementById("viewer")
);

// const createViewer = async () => {
//   const indexBufferInfo = new IndexBufferInfo(webGLController.context);
//   const indexBufferBindingValue = new Observable<number[]>([]);

//   const onMeshChanged = (id: string) => {

//     indexBufferBindingValue.setValue(indices);
//   };

//   const {
//     element: indexBufferElement,
//   } = createIndexBufferComponent(indexBufferBindingValue, newValue =>
//     indexBufferInfo.setValue(newValue)
//   );
//   const indexBufferComponent = withLabel(indexBufferElement, "Indices");
