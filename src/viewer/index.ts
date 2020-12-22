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

  let selectedVertex: DropdownItem | null = null;
  let selectedFragment: DropdownItem | null = null;
  let selectedVertexWatcherUnsubscribe: Unsubscribe | undefined;
  let selectedFragmentWatcherUnsubscribe: Unsubscribe | undefined;

  const onShadersChanged = () => {
    shaderOptions.innerHTML = "";

    if (selectedVertex && selectedFragment)
      appendWithShaderOptions(shaderOptions);
  };

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
    (newVertex) => {
      selectedVertexWatcherUnsubscribe?.();

      if (newVertex) {
        selectedVertexWatcherUnsubscribe = vscodeApi.subscribeToDocumentChange(
          newVertex.id, (newContent) => {
            console.log('new content', newContent);
          });
      }

      selectedFragment = newVertex;
      onShadersChanged();
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
    (newFragment) => {
      selectedFragment = newFragment;
      onShadersChanged();
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
