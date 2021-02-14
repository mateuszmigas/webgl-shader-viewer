import { observeElementBoundingRect } from "../utils/html";
export const createWebGLCanvas = (
  className: string
): [
  HTMLCanvasElement,
  {
    context: WebGLRenderingContext;
    getSize: () => { width: number; height: number };
  }
] => {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  const context = canvas.getContext("webgl");
  let width = 0;
  let height = 0;

  observeElementBoundingRect(canvas, rect => {
    canvas.width = rect.width;
    canvas.height = rect.height;
    width = rect.width;
    height = rect.height;
  });

  if (!context) {
    //todo move to errors
    throw new Error("Unable to create webgl context");
  }

  return [
    canvas,
    {
      context,
      getSize: () => ({ width, height }),
    },
  ];
};
