import { CameraPosition } from "@utils/cameraManipulator";
import { DrawMode } from "@utils/webgl/index";
import { vscodeApi } from "./communication/vscodeApi";

export type AttributeBufferState = { type: number; optionId: string; value: string; error: string };
export type IndexBufferState = { optionId: string; value: string; error: string };
export type TextureState = {
  optionId: string;
  workspaceUrl: string;
  customUrl: string;
  error: string;
};
export type UniformState = {
  type: number;
  optionId: string;
  value: any;
};

export type ExtensionState = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  uniformValues: Record<string, UniformState>;
  attributeBufferValues: Record<string, AttributeBufferState>;
  indexBufferValue: IndexBufferState;
  textureValues: Record<string, TextureState>;
  cameraPosition: CameraPosition;
  drawMode: DrawMode;
  meshId: string;
};

const defaultState: ExtensionState = {
  vertexFilePath: null,
  fragmentFilePath: null,
  uniformValues: {},
  attributeBufferValues: {},
  indexBufferValue: { optionId: "indices", value: "[]", error: "" },
  textureValues: {},
  cameraPosition: { longitude: 1, latitude: 1, radius: 2 },
  drawMode: "elements",
  meshId: "cube",
};

export const getExtensionState = (): ExtensionState => ({
  ...defaultState,
  ...vscodeApi.getState(),
});

export const setExtensionState = (newState: Partial<ExtensionState>) =>
  vscodeApi.setState(newState);
