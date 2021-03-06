import { viewerEndpoint } from "./../../common/communication/viewerEndpoint";
import {
  CameraPosition,
  CameraPositionManipulator,
  cameraPositionToVector3,
} from "./utils/cameraManipulator";
import { getState, setState } from "./../../common/state";
import { IndexBufferInfo } from "./utils/webgl/indexBuffer";
import { translations } from "../../common/translations";
import { createDropdown } from "./components/dropdown";
import { createSectionTitle } from "./components/header";
import { createButton as createButton } from "./components/button";
import { createDiv, withLabel } from "./components/wrappers";
import {
  createUniformComponents,
  UniformBinding,
} from "./utils/webgl/uniformComponent";
import {
  compileShadersFromSource,
  createComponentsForProgram,
  DrawOptions,
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
  ShaderCompileErrors,
} from "./utils/webgl/index";
import { createAttributeBufferComponents } from "./utils/webgl/attributeBufferComponent";
import { createWebGLCanvas } from "./components/webglCanvas";
import { createMeshBindings, meshes } from "./meshes";
import { mat4 } from "./utils/math";
import { UniformType } from "./utils/webgl/uniform";
import { Observable } from "./utils/observable";
import { createIndexBufferComponent } from "./utils/webgl/indexBufferComponent";
import { imageExtensions, shaderExtensions } from "./constants";

export const createUniformBindings = () =>
  new Map<string, UniformBinding>([
    [
      "localToProjected",
      {
        name: "Binding - Camera LocalToProjected",
        type: UniformType.FLOAT_MAT4,
        value: new Observable([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      },
    ],
  ]);

const setElementVisibility = (element: HTMLElement, visible: boolean) =>
  (element.style.display = visible ? "inherit" : "none");

const createViewer = async () => {
  const viewerState = getState();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content shader-errors");
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");
  const meshBindings = createMeshBindings();
  const uniformBindings = createUniformBindings();
  const indexBufferInfo = new IndexBufferInfo(webGLController.context);
  const indexBufferBindingValue = new Observable<number[]>([]);
  const drawOptions: DrawOptions = { drawMode: "arrays" };
  let cameraPosition: CameraPosition = { longitude: 1, latitude: 1, radius: 2 };
  const cameraPositionManipulator = new CameraPositionManipulator(
    webGLCanvas,
    () => cameraPosition,
    newPosition => {
      cameraPosition = newPosition;

      const fieldOfView = (45 * Math.PI) / 180; // in radians
      const { width, height } = webGLController.getSize();
      const aspect = width / height;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      const modelViewMatrix = mat4.create();
      const vec = cameraPositionToVector3(cameraPosition);

      mat4.lookAt(modelViewMatrix, [vec.x, vec.y, vec.z], [0, 0, 0], [0, 1, 0]);

      const res = mat4.create();
      mat4.multiply(res, projectionMatrix, modelViewMatrix);

      uniformBindings.get("localToProjected").value.setValue(res);
    }
  );

  viewer.appendChild(webGLCanvas);
  viewer.appendChild(shaderCompilationErrors);
  viewer.appendChild(viewerOptions);

  const addSectionWithElements = (elements: HTMLElement[], title: string) => {
    shaderOptions.appendChild(
      createDiv("viewer-shaders-title", [createSectionTitle(title, "").element])
    );
    elements.forEach(e => shaderOptions.appendChild(e));
  };

  const showContent = (content: "canvas" | "errors" | "none") => {
    webGLCanvas.style.visibility =
      content === "canvas" ? "visible" : "collapse";
    shaderCompilationErrors.style.visibility =
      content === "errors" ? "visible" : "collapse";

    //setElementVisibility(webGLCanvas, content === "canvas");
    //setElementVisibility(shaderCompilationErrors, content === "errors");
  };

  const sync = () => {
    viewerEndpoint.getWorkspaceFilesOfTypes(shaderExtensions).then(sd => {
      const files = sd.map(f => ({
        id: f.uri,
        display: f.fileName,
      }));

      vertexDropdownController.setItems(files);

      if (
        viewerState.vertexFilePath &&
        files.some(f => f.id === viewerState.vertexFilePath)
      )
        vertexDropdownController.setSelectedItemById(
          viewerState.vertexFilePath
        );

      fragmentDropdownController.setItems(files);

      if (
        viewerState.fragmentFilePath &&
        files.some(f => f.id === viewerState.fragmentFilePath)
      )
        fragmentDropdownController.setSelectedItemById(
          viewerState.fragmentFilePath
        );
    });
    viewerEndpoint.getWorkspaceFilesOfTypes(imageExtensions).then(id => {
      console.log("id", id);
    });
  };

  let selectedVertexFileWatcherUnsubscribe: () => void | undefined;
  let selectedFragmentFileWatcherUnsubscribe: () => void | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;
  let animationFrameHandle: number = null;

  const onMeshChanged = (id: string) => {
    const { positions, colors, textureCoordinates, indices } = meshes.get(id);
    //todo make it strongly typed object
    meshBindings.get("positions").value.setValue(positions);
    meshBindings.get("colors").value.setValue(colors);
    meshBindings.get("textureCoordinates").value.setValue(textureCoordinates);
    indexBufferBindingValue.setValue(indices);
  };

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";
    const context = webGLController.context;

    if (selectedFragmentContent && selectedVertexContent) {
      const result = compileShadersFromSource(
        context,
        selectedVertexContent,
        selectedFragmentContent
      );

      if (Array.isArray(result)) {
        showContent("errors");
        shaderCompilationErrors.innerText = formatShaderCompileErrors(
          result as ShaderCompileErrors
        );
      } else {
        showContent("canvas");
        const program = result as WebGLProgram;
        const {
          uniformComponents,
          textureComponents,
          attributeBufferComponents,
        } = createComponentsForProgram(context, program, {
          uniform: uniformBindings,
          mesh: meshBindings,
        });

        if (uniformComponents.length > 0) {
          addSectionWithElements(
            uniformComponents.map(uc => uc.component),
            "UNIFORMS"
          );
        }
        if (textureComponents.length > 0) {
          addSectionWithElements(
            textureComponents.map(tc => tc.component),
            "TEXTURES"
          );
        }
        if (attributeBufferComponents.length > 0) {
          addSectionWithElements(
            attributeBufferComponents.map(ab => ab.component),
            "ATTRIBUTE BUFFERS"
          );
        }

        const uniformInfos = uniformComponents.map(uc => uc.uniformInfo);
        const textureInfos = textureComponents.map(tc => tc.textureInfo);
        const attributeBufferInfos = attributeBufferComponents.map(
          abc => abc.attributeBufferInfo
        );

        if (animationFrameHandle !== null)
          cancelAnimationFrame(animationFrameHandle);

        const render = () => {
          renderProgram(
            context,
            program,
            {
              uniformInfos,
              textureInfos,
              attributeBufferInfos,
              indexBufferInfo,
            },
            drawOptions
          );

          animationFrameHandle = requestAnimationFrame(render);
        };

        render();
      }
    } else {
      showContent("none");
    }
  };

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle(translations.shaders, "").element,
      createButton("Sync", "viewer-refresh-button", sync).element,
    ])
  );

  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    async newVertex => {
      selectedVertexFileWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexFileWatcherUnsubscribe = viewerEndpoint.subscribeToDocumentSave(
          newVertex.id,
          newContent => {
            selectedVertexContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedVertexContent = newVertex
        ? await viewerEndpoint.getDocumentText(newVertex.id)
        : "";

      setState({ vertexFilePath: newVertex ? newVertex.id : null });
      onShaderContentChanged();
    }
  );
  vertexDropdownController.setSelectedItemById(viewerState.vertexFilePath);
  viewerOptions.appendChild(withLabel(vertexDropdownElement, "Vertex Shader"));

  const [fragmentDropdownElement, fragmentDropdownController] = createDropdown(
    async newFragment => {
      selectedFragmentFileWatcherUnsubscribe?.();

      if (newFragment) {
        selectedFragmentFileWatcherUnsubscribe = viewerEndpoint.subscribeToDocumentSave(
          newFragment.id,
          newContent => {
            selectedFragmentContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedFragmentContent = newFragment
        ? await viewerEndpoint.getDocumentText(newFragment.id)
        : "";

      setState({ fragmentFilePath: newFragment ? newFragment.id : null });
      onShaderContentChanged();
    }
  );
  fragmentDropdownController.setSelectedItemById(viewerState.fragmentFilePath);
  viewerOptions.appendChild(
    withLabel(fragmentDropdownElement, "Fragment Shader")
  );

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle("DRAW OPTIONS", "").element,
    ])
  );

  const [meshDropdownElement, meshDropdownController] = createDropdown(item => {
    if (!item) return;

    onMeshChanged(item.id);
    setState({ meshId: item.id });
  });
  meshDropdownController.setItems(
    Array.from(meshes.entries()).map(([key, value]) => ({
      id: key,
      display: value.display,
    }))
  );
  meshDropdownController.setSelectedItemById(viewerState.meshId);
  viewerOptions.appendChild(withLabel(meshDropdownElement, "Mesh"));

  const {
    element: indexBufferElement,
  } = createIndexBufferComponent(indexBufferBindingValue, newValue =>
    indexBufferInfo.setValue(newValue)
  );
  const indexBufferComponent = withLabel(indexBufferElement, "Indices");

  const [drawModeElement, drawModeController] = createDropdown(item => {
    if (!item) return;
    drawOptions.drawMode = item.id as "arrays" | "elements";
    setElementVisibility(
      indexBufferComponent,
      drawOptions.drawMode === "elements"
    );
    setState({ drawMode: item.id });
  });
  drawModeController.setItems([
    { id: "arrays", display: "Arrays" },
    { id: "elements", display: "Elements" },
  ]);
  drawModeController.setSelectedItemById(viewerState.drawMode);
  viewerOptions.appendChild(withLabel(drawModeElement, "Draw mode"));

  viewerOptions.appendChild(indexBufferComponent);

  viewerOptions.appendChild(shaderOptions);

  sync();
};

createViewer();
