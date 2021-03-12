import { repeat } from "./array";
import { Matrix4Array } from "./../viewer/src/types";
import { vscodeApi } from "./communication/vscodeApi";

export type ExtensionState = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  uniformValues: { [key: string]: { type: number; value: any } };
  attributeBufferValues: { [key: string]: { type: number; value: any } };
  textureValues: { [key: string]: { optionId: string; optionValue: string } };
  cameraPosition: Matrix4Array;
  //drawMode: string;
  //meshId: string;
};

const defaultState: ExtensionState = {
  vertexFilePath: null,
  fragmentFilePath: null,
  uniformValues: {},
  attributeBufferValues: {},
  textureValues: {},
  cameraPosition: repeat(16, 0) as Matrix4Array,
  //drawMode: "elements",
  //meshId: "cube",
};

export const getExtensionState = (): ExtensionState => ({
  ...defaultState,
  ...vscodeApi.getState(),
});
export const setExtensionState = (newState: Partial<ExtensionState>) =>
  vscodeApi.setState(newState);
