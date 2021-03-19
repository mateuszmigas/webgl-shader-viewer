import { IndexBufferInfo } from "./indexBuffer";

let indexBufferInfo: IndexBufferInfo;

export const getIndexBufferInfo = () => indexBufferInfo;

export const getOrCreateIndexBufferInfo = (context: WebGLRenderingContext) => {
  if (!indexBufferInfo) {
    indexBufferInfo = new IndexBufferInfo(context);
  }

  return indexBufferInfo;
};
