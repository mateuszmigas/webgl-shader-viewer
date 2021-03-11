import { vscodeApi } from "./communication/vscodeApi";

export type ExtensionState = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  uniformValues: { [key: string]: { type: number; value: any } };
  attributeBufferValues: { [key: string]: { type: number; value: any } };
  textureValues: { [key: string]: { optionId: string; optionValue: string } };
  //drawMode: string;
  //meshId: string;
};

const defaultState: ExtensionState = {
  vertexFilePath: null,
  fragmentFilePath: null,
  uniformValues: {},
  attributeBufferValues: {},
  textureValues: {},
  //drawMode: "elements",
  //meshId: "cube",
};

export const getExtensionState = (): ExtensionState => ({
  ...defaultState,
  ...vscodeApi.getState(),
});
export const setExtensionState = (newState: Partial<ExtensionState>) =>
  vscodeApi.setState(newState);
