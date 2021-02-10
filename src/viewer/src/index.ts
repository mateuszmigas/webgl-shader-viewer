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
import { createUniformComponents } from "./utils/webgl/uniformComponent";
import {
  compileShadersFromSource,
  DrawOptions,
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
  ShaderCompileErrors,
} from "./utils/webgl/index";
import { createAttributeBufferComponents } from "./utils/webgl/attributeBufferComponent";
import { createWebGLCanvas } from "./components/webglCanvas";
import { ViewerEndpoint } from "../../common/communication/viewerEndpoint";
import { createMeshBindings, meshes } from "./meshes";
import { mat4, vec3 } from "./utils/math";

const createViewer = async () => {
  const viewerEndpoint = new ViewerEndpoint();
  const viewerState = getState();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content shader-errors");
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");
  const meshAttributeBindings = createMeshBindings();
  const drawOptions: DrawOptions = { drawMode: "arrays" };
  let cameraPosition: CameraPosition = { longitude: 1, latitude: 1, radius: 2 };
  const cameraPositionManipulator = new CameraPositionManipulator(
    webGLCanvas,
    () => cameraPosition,
    newPosition => {
      cameraPosition = newPosition;
      console.log("viewport", cameraPosition);
    }
  );

  viewer.appendChild(webGLCanvas);
  viewer.appendChild(shaderCompilationErrors);
  viewer.appendChild(viewerOptions);

  const showContent = (content: "canvas" | "errors" | "none") => {
    webGLCanvas.style.visibility =
      content === "canvas" ? "visible" : "collapse";
    shaderCompilationErrors.style.visibility =
      content === "errors" ? "visible" : "collapse";
  };

  const syncShaderDocuments = () => {
    viewerEndpoint.getShaderDocuments().then(sd => {
      const files = sd.map(f => ({
        id: f.filePath,
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
  };

  let selectedVertexFileWatcherUnsubscribe: () => void | undefined;
  let selectedFragmentFileWatcherUnsubscribe: () => void | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;
  let animationFrameHandle: number = null;

  const onMeshChanged = (id: string) => {
    const { positions, colors } = meshes.get(id);
    meshAttributeBindings.get("positions").value.setValue(positions);
    meshAttributeBindings.get("colors").value.setValue(colors);
    //meshAttributeBindings.get("normals").value.setValue(normals);
  };

  //

  //

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
        const programUniforms = getProgramUniforms(context, program);
        const programAttributeBuffers = getProgramAttributeBuffers(
          context,
          program
        );

        const uniformComponents = createUniformComponents(
          context,
          program,
          programUniforms
        );
        uniformComponents.forEach(uc =>
          shaderOptions.appendChild(uc.component)
        );

        const attributeBufferComponents = createAttributeBufferComponents(
          context,
          program,
          programAttributeBuffers,
          Array.from(meshAttributeBindings.values())
        );
        attributeBufferComponents.forEach(ab =>
          shaderOptions.appendChild(ab.component)
        );

        const uniformInfos = uniformComponents.map(uc => uc.uniformInfo);
        const attributeBufferInfos = attributeBufferComponents.map(
          abc => abc.attributeBufferInfo
        );

        const indexBufferInfo = new IndexBufferInfo(context);
        indexBufferInfo.setValue([
          0,
          1,
          2,
          0,
          2,
          3, // front
          4,
          5,
          6,
          4,
          6,
          7, // back
          8,
          9,
          10,
          8,
          10,
          11, // top
          12,
          13,
          14,
          12,
          14,
          15, // bottom
          16,
          17,
          18,
          16,
          18,
          19, // right
          20,
          21,
          22,
          20,
          22,
          23, // left
        ]);

        if (animationFrameHandle !== null)
          cancelAnimationFrame(animationFrameHandle);

        let cubeRotation = 0;
        const view = uniformInfos.find(
          u => u.getUniformName() === "uModelViewMatrix"
        );
        const projection = uniformInfos.find(
          u => u.getUniformName() === "uProjectionMatrix"
        );

        let then = 0;

        // Draw the scene repeatedly
        // function render(now) {
        //   now *= 0.001;  // convert to seconds
        //   const deltaTime = now - then;
        //   then = now;

        //   drawScene(gl, programInfo, buffers, deltaTime);

        //   requestAnimationFrame(render);
        // }

        const render = (now: number) => {
          now *= 0.001;
          const deltaTime = now - then;
          then = now;
          const fieldOfView = (45 * Math.PI) / 180; // in radians
          const canvas = context.canvas as HTMLCanvasElement;
          const aspect = canvas.clientWidth / canvas.clientHeight;
          const zNear = 0.1;
          const zFar = 100.0;
          const projectionMatrix = mat4.create();

          // note: glmatrix.js always has the first argument
          // as the destination to receive the result.
          mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

          // Set the drawing position to the "identity" point, which is
          // the center of the scene.
          const modelViewMatrix = mat4.create();
          const vec = cameraPositionToVector3(cameraPosition);

          mat4.lookAt(
            modelViewMatrix,
            vec3.fromValues(vec.x, vec.y, vec.z),
            vec3.create(),
            vec3.fromValues(0, 1, 0)
          );

          // mat4.translate(
          //   modelViewMatrix, // destination matrix
          //   modelViewMatrix, // matrix to translate
          //   [-0.0, 0.0, -6.0]
          // ); // amount to translate
          // mat4.rotate(
          //   modelViewMatrix, // destination matrix
          //   modelViewMatrix, // matrix to rotate
          //   cubeRotation, // amount to rotate in radians
          //   [0, 0, 1]
          // ); // axis to rotate around (Z)
          // mat4.rotate(
          //   modelViewMatrix, // destination matrix
          //   modelViewMatrix, // matrix to rotate
          //   cubeRotation * 0.7, // amount to rotate in radians
          //   [0, 1, 0]
          // ); // axis to rotate around (X)
          // mat4.rotate(
          //   modelViewMatrix, // destination matrix
          //   modelViewMatrix, // matrix to rotate
          //   cubeRotation * 0.2, // amount to rotate in radians
          //   [1, 0, 0]
          // ); // axis to rotate around (Y)

          projection.setValue(projectionMatrix);
          view.setValue(modelViewMatrix);

          renderProgram(
            context,
            program,
            {
              uniformInfos,
              attributeBufferInfos,
              indexBufferInfo,
            },
            drawOptions
          );

          cubeRotation += deltaTime;
          animationFrameHandle = requestAnimationFrame(render);
        };

        render(0);
      }
    } else {
      showContent("none");
    }
  };

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle(translations.shaders, "").element,
      createButton("Sync", "viewer-refresh-button", syncShaderDocuments)
        .element,
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

  const [meshDropdownElement, meshDropdownController] = createDropdown(
    item => item && onMeshChanged(item.id),
    undefined,
    { emptyItem: false }
  );
  meshDropdownController.setItems(
    Array.from(meshes.entries()).map(([key, value]) => ({
      id: key,
      display: value.display,
    }))
  );
  meshDropdownController.setSelectedItemByIndex(0);

  viewerOptions.appendChild(withLabel(meshDropdownElement, "Mesh"));

  const [drawModeElement, drawModeController] = createDropdown(
    item => {
      if (!item) return;
      drawOptions.drawMode = item.id as "arrays" | "elements";
      setState({ drawMode: item.id });
    },
    undefined,
    { emptyItem: false }
  );
  drawModeController.setItems([
    { id: "arrays", display: "Arrays" },
    { id: "elements", display: "Elements" },
  ]);
  drawModeController.setSelectedItemById(viewerState.drawMode);
  viewerOptions.appendChild(withLabel(drawModeElement, "Draw mode"));

  //indexes

  viewerOptions.appendChild(shaderOptions);

  syncShaderDocuments();
};

createViewer();
