import { IndexBufferInfo } from "./utils/webgl/indexBuffer";
import { Observable } from "./utils/observable";
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

const createViewer = async () => {
  const viewerEndpoint = new ViewerEndpoint();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content shader-errors");
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");
  const meshAttributeBindings = createMeshBindings();
  const drawOptions: DrawOptions = { drawMode: "arrays" };

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
      fragmentDropdownController.setItems(files);
    });
  };

  let selectedVertexFileWatcherUnsubscribe: () => void | undefined;
  let selectedFragmentFileWatcherUnsubscribe: () => void | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;
  let animationFrameHandle: number = null;

  const onMeshChanged = (id: string) => {
    const { positions } = meshes.get(id);
    meshAttributeBindings.get("positions").value.setValue(positions);
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

        const render = () => {
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
      onShaderContentChanged();
    }
  );
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
      onShaderContentChanged();
    }
  );
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
    item => item && (drawOptions.drawMode = item.id as "arrays" | "elements"),
    undefined,
    { emptyItem: false }
  );
  drawModeController.setItems([
    { id: "arrays", display: "Arrays" },
    { id: "elements", display: "Elements" },
  ]);
  viewerOptions.appendChild(withLabel(drawModeElement, "Draw mode"));

  viewerOptions.appendChild(shaderOptions);

  syncShaderDocuments();
};

createViewer();
