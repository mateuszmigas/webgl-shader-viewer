import { createTextArea } from "./components/textArea";
import { createDropdown } from "./components/dropdown";
import { VsCodeApiProxy } from "./communicationProxy";
import { createSectionTitle } from "./components/createSectionTitle";

const createDivSection = (text: string) => {
  const div = document.createElement("div");
  div.className = text;
  return div;
};

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();
  const element = document.getElementById("viewer");
  const options = document.createElement("div");
  options.className = "viewer-options";

  options.appendChild(createDivSection("viewer-shaders-title"));
  options.appendChild(createDivSection("viewer-refresh-button"));
  options.appendChild(createDivSection("viewer-vertex-shader-selector"));
  options.appendChild(createDivSection("viewer-fragment-shader-selector"));
  options.appendChild(createDivSection("viewer-shader-options"));

  // const { element: shadersEl } = createSectionTitle("shaders");
  // options.appendChild(shadersEl);

  // const refreshButton = document.createElement("button");
  // //refreshButton.

  // const canvas = document.createElement("canvas");
  // canvas.className = "viewer-content";

  // const {
  //   element: dropdownElement,
  //   controller: dropdownController,
  // } = createDropdown((item) => {
  //   console.log("item changed", item);
  // });

  // const {
  //   element: textAreaElement,
  //   controller: textAreaController,
  // } = createTextArea();

  // options.appendChild(dropdownElement);
  // options.appendChild(textAreaElement);

  element.appendChild(options);

  // const files = await vscodeApi.getShaderDocuments();
  // dropdownController.setItems(
  //   files.map((f) => ({
  //     id: f.filePath,
  //     display: f.fileName,
  //   }))
  // );
  // vscodeApi.onDidShaderDocumentsChange((docs) => {
  //   console.log("docs changed");
  //   dropdownController.setItems(
  //     docs.map((f) => ({
  //       id: f.filePath,
  //       display: f.fileName,
  //     }))
  //   );
  // });

  // canvas.width = 500;
  // canvas.height = 500;
  // element.appendChild(canvas);
  // const context = canvas.getContext("2d");
  // context.fillStyle = "green";
  // context.fillRect(150, 150, 200, 450);
};

createViewer();
