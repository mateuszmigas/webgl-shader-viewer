import { createDiv } from "./components/common";
import { createDropdown } from "./components/dropdown";
import { createColor4 } from "./components/editColor";
import {
  createVector3,
  createVector4,
  createMatrix3,
} from "./components/editVector3";
import { withLabel } from "./components/wrappers";

//const attributeBuffers

//name, type => value

export type AttributeBufferType = "vector2" | "vector3" | "vector4";
export type UniformType = "vec2" | "vec3";

export class CompositeKeyMap<TKey, TValue> {
  private map = new Map<string, TValue>();

  constructor(private keySelector: (compositeKey: TKey) => string) {}

  get(key: TKey) {
    this.map.get(this.keySelector(key));
  }

  set(key: TKey, value: TValue) {
    this.map.set(this.keySelector(key), value);
  }

  clear() {
    this.map.clear();
  }
}

const attributeBuffers = new CompositeKeyMap<
  { name: string; bufferType: AttributeBufferType },
  string
>((key) => `${key.name};${key.bufferType}`);

const uniforms = new CompositeKeyMap<
  { name: string; uniformType: UniformType },
  string
>((key) => `${key.name};${key.uniformType}`);

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
