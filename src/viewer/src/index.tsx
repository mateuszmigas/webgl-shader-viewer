import React from "react";
import ReactDOM from "react-dom";
import { setExtensionState } from "../../common/extensionState";
import { ViewerOptions } from "./components/ViewerOptions";
import { ViewerContent } from "./components/ViewerContent";
import { createStore, Store } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./store/reducer";
import { ViewerAction } from "./store/actions";
import { ViewerState } from "./store/state";

export const App = () => (
  <>
    <ViewerOptions></ViewerOptions>
    <ViewerContent></ViewerContent>
  </>
);

const store: Store<ViewerState, ViewerAction> = createStore(reducer);
store.subscribe(() => {
  const { counter, ...state } = store.getState();
  setExtensionState(state);
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("viewer")
);

// const createViewer = async () => {
//   const viewerState = getState();
//   const viewer = document.getElementById("viewer");
//   const viewerOptions = createDiv("viewer-options");
//   const shaderOptions = createDiv("viewer-shader-options");
//   const shaderCompilationErrors = createDiv("viewer-content shader-errors");
//   const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");
//   const meshBindings = createMeshBindings();
//   const uniformBindings = createUniformBindings();
//   const indexBufferInfo = new IndexBufferInfo(webGLController.context);
//   const indexBufferBindingValue = new Observable<number[]>([]);
//   const drawOptions: DrawOptions = { drawMode: "arrays" };

//   viewer.appendChild(webGLCanvas);
//   viewer.appendChild(shaderCompilationErrors);
//   viewer.appendChild(viewerOptions);

//   const addSectionWithElements = (
//     elements: HTMLElement[],
//     title: string,
//     syncCallback?: () => void
//   ) => {
//     const titleElements: HTMLElement[] = [
//       createSectionTitle(title, "").element,
//     ];

//     if (syncCallback) {
//       titleElements.push(
//         createButton("Sync", "viewer-refresh-button", syncCallback).element
//       );
//     }
//     shaderOptions.appendChild(createDiv("viewer-shaders-title", titleElements));
//     elements.forEach(e => shaderOptions.appendChild(e));
//   };

//   let selectedVertexFileWatcherUnsubscribe: () => void | undefined;
//   let selectedFragmentFileWatcherUnsubscribe: () => void | undefined;
//   let selectedVertexContent: string | null;
//   let selectedFragmentContent: string | null;
//   let animationFrameHandle: number = null;

//   const onMeshChanged = (id: string) => {
//     const { positions, colors, textureCoordinates, indices } = meshes.get(id);
//     //todo make it strongly typed object
//     meshBindings.get("positions").value.setValue(positions);
//     meshBindings.get("colors").value.setValue(colors);
//     meshBindings.get("textureCoordinates").value.setValue(textureCoordinates);
//     indexBufferBindingValue.setValue(indices);
//   };

//   const onShaderContentChanged = () => {
//     shaderOptions.innerHTML = "";
//     const context = webGLController.context;

//     if (selectedFragmentContent && selectedVertexContent) {
//       const result = compileShadersFromSource(
//         context,
//         selectedVertexContent,
//         selectedFragmentContent
//       );

//       if (Array.isArray(result)) {
//         showContent("errors");
//         shaderCompilationErrors.innerText = formatShaderCompileErrors(
//           result as ShaderCompileErrors
//         );
//       } else {
//         showContent("canvas");
//         const program = result as WebGLProgram;
//         const {
//           uniformComponents,
//           textureComponents,
//           attributeBufferComponents,
//         } = createComponentsForProgram(context, program, {
//           uniform: uniformBindings,
//           mesh: meshBindings,
//         });

//         if (uniformComponents.length > 0) {
//           addSectionWithElements(
//             uniformComponents.map(uc => uc.component),
//             "UNIFORMS"
//           );
//         }
//         if (textureComponents.length > 0) {
//           addSectionWithElements(
//             textureComponents.map(tc => tc.component),
//             "TEXTURES",
//             () => {}
//           );
//         }
//         if (attributeBufferComponents.length > 0) {
//           addSectionWithElements(
//             attributeBufferComponents.map(ab => ab.component),
//             "ATTRIBUTE BUFFERS"
//           );
//         }

//         const uniformInfos = uniformComponents.map(uc => uc.uniformInfo);
//         const textureInfos = textureComponents.map(tc => tc.textureInfo);
//         const attributeBufferInfos = attributeBufferComponents.map(
//           abc => abc.attributeBufferInfo
//         );

//         if (animationFrameHandle !== null)
//           cancelAnimationFrame(animationFrameHandle);

//         const render = () => {
//           renderProgram(
//             context,
//             program,
//             {
//               uniformInfos,
//               textureInfos,
//               attributeBufferInfos,
//               indexBufferInfo,
//             },
//             drawOptions
//           );

//           animationFrameHandle = requestAnimationFrame(render);
//         };

//         render();
//       }
//     } else {
//       showContent("none");
//     }
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
