import { createTextArea } from "./components/textArea";
import { createDropdown } from "./components/dropdown";

console.log("fse");

//create section
//create title
//create dropdown
//craete title
//create input

// createDropdown => element, controller { setItems, setSelectedItemId, getSelectedItemId, getItems }

{
  const element = document.getElementById("main-container");
  const canvas = document.createElement("canvas");
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

  element.appendChild(dropdownElement);
  element.appendChild(textAreaElement);
  textAreaController.setText("dupa");

  canvas.width = 500;
  canvas.height = 500;
  element.appendChild(canvas);
  const context = canvas.getContext("2d");
  context.fillStyle = "green";
  context.fillRect(150, 150, 200, 450);
}
