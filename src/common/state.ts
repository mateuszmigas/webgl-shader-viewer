import { vscodeApi } from "./communication/vscodeApi";

type State = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  drawMode: string;
  meshId: string;
};

const defaultState: State = {
  vertexFilePath: null,
  fragmentFilePath: null,
  drawMode: "elements",
  meshId: "cube",
};

export const getViewerState = (): State => vscodeApi.getState() ?? defaultState;
export const setViewerState = (newState: Partial<State>) =>
  vscodeApi.setState(Object.assign(getViewerState(), newState));
