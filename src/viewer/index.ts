import { translations } from './../translations';
import { createDropdown, DropdownItem } from "./components/dropdown";
import { Unsubscribe, VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";
import { createFAButton as createButton } from "./components/createFAButton";
import { withLabel } from "./components/wrappers";
import { createMatrix3, createVector3, createVector4 } from "./components/editVector3";

const createDivSection = (className: string, children?: HTMLElement[]) => {
  const div = document.createElement("div");
  div.className = className;
  children?.forEach(c => div.appendChild(c));
  return div;
};

const createCanvas = (className: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.className = className;
  canvas.width = 500;
  canvas.height = 500;
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
  return canvas;
}

const compileAndGenerate = async () => {
  //get shaders text
  //compile shader
  //generate shader options

  //old shader options
  //new shader options
  //apply change if:
  //name + type changed
}
const appendWithShaderOptions = (element: HTMLElement) => {
  element.appendChild(withLabel(createVector3()[0], "", "u_color"));
  element.appendChild(withLabel(createVector4()[0], "", "u_diffuse"));

  const [mat3el, mat3con] = createMatrix3(newval => console.log(newval));
  const [ediff, cdiff] =
    createDropdown(
      (sel) => {
        if (!sel)
          return;
        if (sel.id === "0") {
          mat3con.setReadonly(false);
        }
        if (sel.id === "1") {
          mat3con.setReadonly(true);
        }
      },
      "",
      { emptyItem: false }
    );

  cdiff.setItems([{ id: "0", display: "Color picker" }, { id: "1", display: "Custom2" }]);
  cdiff.setSelectedItemById("0");

  element.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [ediff, mat3el]), "", "dobre diffuse"));

  element.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [createDropdown(
          (newFragment) => {
          }
        )[0], createMatrix3(newval => console.log(newval))[0]]), "", "u_diffuse2"))
  element.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [createDropdown(
          (newFragment) => {
          }
        )[0], createMatrix3(newval => console.log(newval))[0]]), "", "u_diffuse2"))

}

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDivSection("viewer-options");
  const shaderOptions = createDivSection("viewer-shader-options");
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
      vertex: selectedVertexContent
    });
  }

  viewerOptions.appendChild(
    createDivSection("viewer-shaders-title", [
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
      }).element
    ])

  );

  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    async (newVertex) => {
      selectedVertexFileWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexFileWatcherUnsubscribe = vscodeApi.subscribeToDocumentSave(
          newVertex.id, (newContent) => {
            selectedVertexContent = newContent;
            onShaderContentChanged();
          });
      }

      selectedVertexContent = newVertex ? await vscodeApi.getDocumentText(newVertex.id) : "";
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
          newFragment.id, (newContent) => {
            selectedFragmentContent = newContent;
            onShaderContentChanged();
          });
      }

      selectedFragmentContent = newFragment ? await vscodeApi.getDocumentText(newFragment.id) : "";
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
