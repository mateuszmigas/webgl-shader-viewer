import { translations } from './../translations';
import { createDropdown, DropdownItem } from "./components/dropdown";
import { VsCodeApiProxy } from "./communicationProxy";
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

const createCanvas = (host: HTMLElement) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  host.appendChild(canvas);
  canvas.className = "viewer-content";
  canvas.width = 500;
  canvas.height = 500;
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
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

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const viewer = document.getElementById("viewer");
  const viewerOptions = createDivSection("viewer-options");
  const shaderOptions = createDivSection("viewer-shader-options");

  viewer.appendChild(viewerOptions);

  let selectedVertex: DropdownItem | null = null;
  let selectedFragment: DropdownItem | null = null;

  const onShadersChanged = () => {
    // /if (selectedFragment)
    //element.innerHTML = "";
    //createShaderOptions(shaderOptions);
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

  //vertex shader
  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    (newVertex) => {
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

  //fragment shader
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

  shaderOptions.appendChild(withLabel(createVector3()[0], "", "u_color"));
  shaderOptions.appendChild(withLabel(createVector4()[0], "", "u_diffuse"));

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

  cdiff.setItems([{ id: "0", display: "Color picker" }, { id: "1", display: "Custom" }]);
  cdiff.setSelectedItemById("0");


  shaderOptions.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [ediff, mat3el]), "", "dobre diffuse"));

  shaderOptions.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [createDropdown(
          (newFragment) => {
            selectedFragment = newFragment;
            onShadersChanged();
          }
        )[0], createMatrix3(newval => console.log(newval))[0]]), "", "u_diffuse2"))
  shaderOptions.appendChild(
    withLabel(
      createDivSection("column-with-gap",
        [createDropdown(
          (newFragment) => {
            selectedFragment = newFragment;
            onShadersChanged();
          }
        )[0], createMatrix3(newval => console.log(newval))[0]]), "", "u_diffuse2"))

  createCanvas(viewer);

};

createViewer();
