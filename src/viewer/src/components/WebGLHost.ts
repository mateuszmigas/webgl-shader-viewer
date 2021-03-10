import { observeElementBoundingRect } from "../utils/html";

export const canvas = document.createElement("canvas");
export const context = canvas.getContext("webgl");
let width = 0;
let height = 0;

observeElementBoundingRect(canvas, rect => {
  canvas.width = rect.width;
  canvas.height = rect.height;
  width = rect.width;
  height = rect.height;
});

if (!context) {
  throw new Error("Unable to create webgl context");
}
