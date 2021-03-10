import { vscodeApi } from "./communication/vscodeApi";

export type ExtensionState = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  attributeBufferValues: { [key: string]: { type: number; value: any } };
  //drawMode: string;
  //meshId: string;
};

const defaultState: ExtensionState = {
  vertexFilePath: null,
  fragmentFilePath: null,
  attributeBufferValues: {},
  //drawMode: "elements",
  //meshId: "cube",
};

export const getExtensionState = (): ExtensionState => ({
  ...defaultState,
  ...vscodeApi.getState(),
});
export const setExtensionState = (newState: Partial<ExtensionState>) =>
  vscodeApi.setState(newState);
