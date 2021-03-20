import { customOption } from "./../viewer/src/components/common/constants";
import { CameraPosition } from "./../viewer/src/utils/cameraManipulator";
import { DrawMode } from "./../viewer/src/utils/webgl/index";
import { vscodeApi } from "./communication/vscodeApi";

export type ExtensionState = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  uniformValues: Record<
    string,
    {
      type: number;
      optionId: string;
      value: any;
    }
  >;
  attributeBufferValues: Record<
    string,
    { type: number; optionId: string; value: string; error: string }
  >;
  indexBufferValue: { optionId: string; value: string; error: string };
  textureValues: Record<string, { optionId: string; value: string }>;
  cameraPosition: CameraPosition;
  viewerSize: { width: number; height: number };
  drawMode: DrawMode;
  meshId: string;
};

const defaultState: ExtensionState = {
  vertexFilePath: null,
  fragmentFilePath: null,
  uniformValues: {},
  attributeBufferValues: {},
  indexBufferValue: { optionId: customOption.id, value: "[]", error: "" },
  textureValues: {},
  cameraPosition: { longitude: 1, latitude: 1, radius: 2 },
  viewerSize: { width: 0, height: 0 },
  drawMode: "elements",
  meshId: "cube",
};

export const getExtensionState = (): ExtensionState => ({
  ...defaultState,
  ...vscodeApi.getState(),
});
export const setExtensionState = (newState: Partial<ExtensionState>) =>
  vscodeApi.setState(newState);
