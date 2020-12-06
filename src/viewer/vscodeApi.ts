declare const acquireVsCodeApi: () => {
  getState: () => any;
  setState: (state: any) => void;
  postMessage: (message: any) => void;
};
export const vscodeApi = acquireVsCodeApi();
