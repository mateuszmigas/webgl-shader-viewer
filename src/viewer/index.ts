import { createDropdown, DropdownItem } from "./components/dropdown";
import { VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";
import { createFAButton } from "./components/createFAButton";
import { withLabel } from "./components/wrappers";
import { createMatrix3, createVector3, createVector4 } from "./components/editVector3";

const createDivSection = (className: string) => {
  const div = document.createElement("div");
  div.className = className;
  return div;
};

const createShaderOptions = (element: HTMLElement) => {
  element.innerHTML = Math.random().toString();
};



const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const element = document.getElementById("viewer");
  const options = document.createElement("div");
  const shaderOptions = createDivSection("viewer-shader-options");
  options.appendChild(shaderOptions);

  options.className = "viewer-options";
  let selectedVertex: DropdownItem | null = null;
  let selectedFragment: DropdownItem | null = null;

  const onShadersChanged = () => {
    // /if (selectedFragment)
    //element.innerHTML = "";
    //createShaderOptions(shaderOptions);
  };

  //vertex shader
  const [vertexDropdownElement, vertexDropdownController] = createDropdown(
    (newVertex) => {
      selectedFragment = newVertex;
      onShadersChanged();
    }
  );
  options.appendChild(
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
  options.appendChild(
    withLabel(
      fragmentDropdownElement,
      "viewer-fragment-shader-selector",
      "Fragment Shader"
    )
  );

  options.appendChild(
    createSectionTitle("SHADERS", "viewer-shaders-title").element
  );

  options.appendChild(
    createFAButton("↻", "viewer-refresh-button", () => {
      vscodeApi.getShaderDocuments().then((sd) => {
        const files = sd.map((f) => ({
          id: f.filePath,
          display: f.fileName,
        }));

        vertexDropdownController.setItems(files);
        fragmentDropdownController.setItems(files);
      });
    }).element
  );

  element.appendChild(options);
  shaderOptions.appendChild(withLabel(createVector3()[0], "", "u_color"));
  shaderOptions.appendChild(withLabel(createVector4()[0], "", "u_diffuse"));
  shaderOptions.appendChild(withLabel(createMatrix3(newval => console.log(newval))[0], "", "u_diffuse2"));

  // const canvas = document.createElement("canvas");
  // canvas.className = "viewer-content";
  // canvas.width = 500;
  // canvas.height = 500;
  // element.appendChild(canvas);
  // const context = canvas.getContext("2d");
  // context.fillStyle = "green";
  // context.fillRect(150, 150, 200, 450);
};

createViewer();
