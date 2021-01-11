import { observeElementBoundingRect } from "../../utils/html";
export const createWebGLCanvas = (
  className: string
): [
  HTMLCanvasElement,
  {
    context: WebGLRenderingContext;
  }
] => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  const context = canvas.getContext("webgl");

  observeElementBoundingRect(canvas, rect => {
    canvas.width = rect.width;
    canvas.height = rect.height;
  });

  if (!context) {
    //todo move to errors
    throw new Error("Unable to create webgl context");
  }

  return [
    canvas,
    {
      context,
    },
  ];
};
