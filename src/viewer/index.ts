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
  dropdownController.setItems([
    { id: "1", display: "ala1" },
    { id: "2", display: "ala2" },
    { id: "3", display: "ala3" },
  ]);
  dropdownController.setSelectedItemById("2");

  const {
    element: textAreaElement,
    controller: textAreaController,
  } = createTextArea();

  options.appendChild(dropdownElement);
  options.appendChild(textAreaElement);

  element.appendChild(options);

  console.log("requesting");

  const files = await vscodeApi.getVisibleTextEditors();
  console.log("files2", files);

  textAreaController.setText(files.join(","));

  canvas.width = 500;
  canvas.height = 500;
  element.appendChild(canvas);
  const context = canvas.getContext("2d");
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
};

createViewer();
