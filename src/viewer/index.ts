import { translations } from "./../translations";
import { createDropdown, DropdownItem } from "./components/dropdown";
import { Unsubscribe, VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";
import { createFAButton as createButton } from "./components/createFAButton";
import { withLabel } from "./components/wrappers";
import {
  createMatrix3,
  createVector3,
  createVector4,
} from "./components/editVector3";
import { appendWithShaderOptions } from "./shaderOptions";
import { createDiv } from "./components/common";

const createCanvas = (className: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.className = className;
  canvas.width = 500;
  canvas.height = 500;
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
  return canvas;
};

const compileAndGenerate = async () => {
  //get shaders text
  //compile shader
  //generate shader options
  //old shader options
  //new shader options
  //apply change if:
  //name + type changed
};

// [1] [2] [3] [] [color]

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDiv("viewer-options");
  const shaderOptions = createDiv("viewer-shader-options");
  const webGLCanvas = createCanvas("viewer-content");

  viewer.appendChild(webGLCanvas);
  viewer.appendChild(viewerOptions);

  let selectedVertexFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedFragmentFileWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedVertexContent: string | null;
  let selectedFragmentContent: string | null;

  const onShaderContentChanged = () => {
    shaderOptions.innerHTML = "";
    console.log({
      fragment: selectedFragmentContent,
      vertex: selectedVertexContent,
    });

    appendWithShaderOptions(shaderOptions);
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
