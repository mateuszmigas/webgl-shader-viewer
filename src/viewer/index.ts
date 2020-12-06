import { createTextArea } from "./components/textArea";
import { createDropdown } from "./components/dropdown";
import { VsCodeApiProxy } from "./communicationProxy";

const createViewer = async () => {
  const vscodeApi = new VsCodeApiProxy();

  const element = document.getElementById("viewer");
  const options = document.createElement("div");
  options.className = "viewer-options";

  const canvas = document.createElement("canvas");
  canvas.className = "viewer-content";

  const {
    element: dropdownElement,
    controller: dropdownController,
  } = createDropdown((item) => {
    console.log("item changed", item);
  });

  const {
    element: textAreaElement,
    controller: textAreaController,
  } = createTextArea();

  options.appendChild(dropdownElement);
  options.appendChild(textAreaElement);

  element.appendChild(options);

  const files = await vscodeApi.getShaderDocuments();
  dropdownController.setItems(
    files.map((f) => ({
      id: f.filePath,
      display: f.fileName,
    }))
  );
  vscodeApi.onDidShaderDocumentsChange((docs) => {
    console.log("docs changed");
    dropdownController.setItems(
      docs.map((f) => ({
        id: f.filePath,
        display: f.fileName,
      }))
    );
  });

  canvas.width = 500;
  canvas.height = 500;
  element.appendChild(canvas);
  const context = canvas.getContext("2d");
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
};

createViewer();
