import React from "react";
import ReactDOM from "react-dom";
import { setExtensionState } from "../../common/extensionState";
import { createStore, Store } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./store/reducer";
import { ViewerAction } from "./store/actions";
import { ViewerState } from "./store/state";
import { Viewer } from "./components/Viewer";

const store: Store<ViewerState, ViewerAction> = createStore(
  (state: ViewerState, action: ViewerAction) => {
    console.log("state before", state);
    console.log("action", action);
    const newLocal = reducer(state, action);
    console.log("state after", newLocal);
    return newLocal;
  }
);
store.subscribe(() => {
  const { counter, ...state } = store.getState();
  setExtensionState(state);
});

ReactDOM.render(
  <Provider store={store}>
    <Viewer />
  </Provider>,
  document.getElementById("viewer")
);

// const createViewer = async () => {
//   const shaderCompilationErrors = createDiv("viewer-content shader-errors");
//   const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");
//   const meshBindings = createMeshBindings();
//   const uniformBindings = createUniformBindings();
//   const indexBufferInfo = new IndexBufferInfo(webGLController.context);
//   const indexBufferBindingValue = new Observable<number[]>([]);
//   const drawOptions: DrawOptions = { drawMode: "arrays" };

//   let animationFrameHandle: number = null;

//   const onMeshChanged = (id: string) => {
//     const { positions, colors, textureCoordinates, indices } = meshes.get(id);
//     //todo make it strongly typed object
//     meshBindings.get("positions").value.setValue(positions);
//     meshBindings.get("colors").value.setValue(colors);
//     meshBindings.get("textureCoordinates").value.setValue(textureCoordinates);
//     indexBufferBindingValue.setValue(indices);
//   };

//   viewerOptions.appendChild(
//     createDiv("viewer-shaders-title", [
//       createSectionTitle("DRAW OPTIONS", "").element,
//     ])
//   );

//   const [meshDropdownElement, meshDropdownController] = createDropdown(item => {
//     if (!item) return;

//     onMeshChanged(item.id);
//     setState({ meshId: item.id });
//   });
//   meshDropdownController.setItems(
//     Array.from(meshes.entries()).map(([key, value]) => ({
//       id: key,
//       display: value.display,
//     }))
//   );
//   meshDropdownController.setSelectedItemById(viewerState.meshId);
//   viewerOptions.appendChild(withLabel(meshDropdownElement, "Mesh"));

//   const {
//     element: indexBufferElement,
//   } = createIndexBufferComponent(indexBufferBindingValue, newValue =>
//     indexBufferInfo.setValue(newValue)
//   );
//   const indexBufferComponent = withLabel(indexBufferElement, "Indices");

//   const [drawModeElement, drawModeController] = createDropdown(item => {
//     if (!item) return;
//     drawOptions.drawMode = item.id as "arrays" | "elements";
//     setElementVisibility(
//       indexBufferComponent,
//       drawOptions.drawMode === "elements"
//     );
//     setState({ drawMode: item.id });
//   });
//   drawModeController.setItems([
//     { id: "arrays", display: "Arrays" },
//     { id: "elements", display: "Elements" },
//   ]);
//   drawModeController.setSelectedItemById(viewerState.drawMode);
//   viewerOptions.appendChild(withLabel(drawModeElement, "Draw mode"));

//   viewerOptions.appendChild(indexBufferComponent);
// };
