import { MessageRequest } from "./messages";

declare const acquireVsCodeApi: () => {
  getState: () => any;
  setState: (state: any) => void;
  postMessage: (message: MessageRequest) => void;
};

export const vscodeApi = acquireVsCodeApi();
