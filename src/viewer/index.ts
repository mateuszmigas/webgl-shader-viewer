import { translations } from "./../translations";
import { createDropdown } from "./components/dropdown";
import { Unsubscribe, VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";
import { createFAButton as createButton } from "./components/createFAButton";
import { withLabel } from "./components/wrappers";
import { appendWithShaderOptions as updateShaderOptions } from "./shaderOptions";
import { createDiv } from "./components/common";
import {
  CompileErrors,
  createWebGLCanvas,
  ShaderController,
} from "./createWebGLCanvas";

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

  let selectedVertexFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedFragmentFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";

    if (selectedFragmentContent && selectedVertexContent) {
      const result = webGLController.compileShaders(
        selectedVertexContent,
        selectedFragmentContent
      );

      if (Array.isArray(result)) {
        showContent("errors");
        const [
          vertexShaderErrors,
          fragmentShaderErrors,
        ] = result as CompileErrors;

        const errors: string[] = [];

        if (vertexShaderErrors) {
          errors.push("VERTEX SHADER:", vertexShaderErrors);
        }

        if (fragmentShaderErrors) {
          errors.push("FRAGMENT SHADER:", fragmentShaderErrors);
        }

        shaderCompilationErrors.innerText = errors.join("\r\n");
      } else {
        showContent("canvas");
        updateShaderOptions(shaderOptions, result as ShaderController);
      }
    } else {
      showContent("none");
    }
  };

  viewerOptions.appendChild(
    createDiv("viewer-shaders-title", [
      createSectionTitle(translations.shaders, "").element,
      createButton("Sync", "viewer-refresh-button", () => {
        vscodeApi.getShaderDocuments().then((sd) => {
          const files = sd.map((f) => ({
            id: f.filePath,
            display: f.fileName,
          }));

          vertexDropdownController.setItems(files);
          fragmentDropdownController.setItems(files);
        });
      }).element,
    ])
  );

  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    async (newVertex) => {
      selectedVertexFileWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newVertex.id,
          (newContent) => {
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
    async (newFragment) => {
      selectedFragmentFileWatcherUnsubscribe?.();

      if (newFragment) {
        selectedFragmentFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newFragment.id,
          (newContent) => {
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
};

createViewer();
