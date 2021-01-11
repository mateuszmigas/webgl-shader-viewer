import { translations } from "./../translations";
import { createDropdown } from "./components/dropdown";
import { Unsubscribe, VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/header";
import { createButton as createButton } from "./components/button";
import { createDiv, withLabel } from "./components/wrappers";
import { createWebGLCanvas, compileShaders } from "./createWebGLCanvas";
import { createUniformComponents } from "../utils/webgl/uniformComponent";
import {
  formatShaderCompileErrors,
  getProgramAttributeBuffers,
  getProgramUniforms,
  renderProgram,
  ShaderCompileErrors,
} from "../utils/webgl/index";
import { createAttributeBufferComponents } from "../utils/webgl/attributeBufferComponent";

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const shaderCompilationErrors = createDiv("viewer-content shader-errors");
  const [webGLCanvas, webGLController] = createWebGLCanvas("viewer-content");

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
    vscodeApi.getShaderDocuments().then(sd => {
      const files = sd.map(f => ({
        id: f.filePath,
        display: f.fileName,
      }));

      vertexDropdownController.setItems(files);
      fragmentDropdownController.setItems(files);
    });
  };

  let selectedVertexFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedFragmentFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;
  let animationFrameHandle: number = null;

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";
    const context = webGLController.context;

    if (selectedFragmentContent && selectedVertexContent) {
      const result = compileShaders(
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
        const uniforms = getProgramUniforms(context, program);
        const attributeBuffers = getProgramAttributeBuffers(context, program);

        const uniformComponents = createUniformComponents(
          context,
          program,
          uniforms
        );
        uniformComponents.forEach(uc =>
          shaderOptions.appendChild(uc.component)
        );

        const attributeBufferComponents = createAttributeBufferComponents(
          context,
          program,
          attributeBuffers
        );
        attributeBufferComponents.forEach(ab =>
          shaderOptions.appendChild(ab.component)
        );

        const uniformInfos = uniformComponents.map(uc => uc.uniformInfo);
        const attributeBufferInfos = attributeBufferComponents.map(
          abc => abc.attributeBufferInfo
        );

        if (animationFrameHandle !== null)
          cancelAnimationFrame(animationFrameHandle);

        const render = () => {
          renderProgram(webGLController.context, result, {
            uniforms: uniformInfos,
            attributeBuffers: attributeBufferInfos,
          });
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
        selectedVertexFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newVertex.id,
          newContent => {
            selectedVertexContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedVertexContent = newVertex
        ? await vscodeApi.getDocumentText(newVertex.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(
    withLabel(
      vertexDropdownElement,
      "viewer-vertex-shader-selector",
      "Vertex Shader"
    )
  );

  const [fragmentDropdownElement, fragmentDropdownController] = createDropdown(
    async newFragment => {
      selectedFragmentFileWatcherUnsubscribe?.();

      if (newFragment) {
        selectedFragmentFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newFragment.id,
          newContent => {
            selectedFragmentContent = newContent;
            onShaderContentChanged();
          }
        );
      }

      selectedFragmentContent = newFragment
        ? await vscodeApi.getDocumentText(newFragment.id)
        : "";
      onShaderContentChanged();
    }
  );
  viewerOptions.appendChild(
    withLabel(
      fragmentDropdownElement,
      "viewer-fragment-shader-selector",
      "Fragment Shader"
    )
  );

  viewerOptions.appendChild(shaderOptions);

  syncShaderDocuments();
};

createViewer();
