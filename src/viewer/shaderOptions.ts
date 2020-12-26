import { createDiv } from "./components/common";
import { createDropdown } from "./components/dropdown";
import { createColor4 } from "./components/editColor";
import {
  createVector3,
  createVector4,
  createMatrix3,
} from "./components/editVector3";
import { withLabel } from "./components/wrappers";

export const appendWithShaderOptions = (element: HTMLElement) => {
  //compile
  //create map
  element.appendChild(withLabel(createColor4()[0], "", "u_color"));
  element.appendChild(withLabel(createVector4()[0], "", "u_diffuse"));

  const [mat3el, mat3con] = createMatrix3((newval) => console.log(newval));
  const [ediff, cdiff] = createDropdown(
    (sel) => {
      if (!sel) return;
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

  cdiff.setItems([
    { id: "0", display: "Color picker" },
    { id: "1", display: "Custom2" },
  ]);
  cdiff.setSelectedItemById("0");

  element.appendChild(
    withLabel(
      createDiv("column-with-gap", [ediff, mat3el]),
      "",
      "dobre diffuse"
    )
  );

  element.appendChild(
    withLabel(
      createDiv("column-with-gap", [
        createDropdown((newFragment) => {})[0],
        createMatrix3((newval) => console.log(newval))[0],
      ]),
      "",
      "u_diffuse2"
    )
  );
  element.appendChild(
    withLabel(
      createDiv("column-with-gap", [
        createDropdown((newFragment) => {})[0],
        createMatrix3((newval) => console.log(newval))[0],
      ]),
      "",
      "u_diffuse2"
    )
  );
};
