import { vscodeApi } from "./communication/vscodeApi";

type State = {
  vertexFilePath: string | null;
  fragmentFilePath: string | null;
  drawMode: string;
};

const defaultState: State = {
  vertexFilePath: null,
  fragmentFilePath: null,
  drawMode: "elements",
};

export const getState = (): State => vscodeApi.getState() ?? defaultState;
export const setState = (newState: Partial<State>) =>
  vscodeApi.setState(Object.assign(getState(), newState));
