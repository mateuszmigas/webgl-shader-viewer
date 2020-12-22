import { remove } from './../utils';
declare const acquireVsCodeApi: () => {
  //getState: () => any;
  //setState: (state: any) => void;
  postMessage: (message: VsCodeApiProxyMessageRequest) => void;
};
export const vscodeApi = acquireVsCodeApi();

export type VsCodeApiProxyMessageRequest =
  | { type: "getShaderDocuments" }
  | { type: "subscribeToDocumentChange", payload: { filePath: string } }
  | { type: "unsubscribeToDocumentChange", payload: { filePath: string } };

export type VsCodeApiProxyMessageResponse = {
  type: "getShaderDocuments";
  payload: { files: { filePath: string; fileName: string }[] };
} | { type: "onDocumentChange", payload: { filePath: string, newContent: string } }

export type Unsubscribe = () => void;

type ProxyResponseListener = (message: VsCodeApiProxyMessageResponse) => void;

export class VsCodeApiProxy {
  eventListeners: ProxyResponseListener[] = [];

  constructor() {
    window.addEventListener("message", (event) => {
      this.eventListeners.forEach((listener) => listener(event.data));
    });
  }

  getShaderDocuments() {
    vscodeApi.postMessage({
      type: "getShaderDocuments",
    });

    return new Promise<{ filePath: string; fileName: string }[]>((resolve) => {
      const listener = (message: VsCodeApiProxyMessageResponse) => {
        if (message.type === "getShaderDocuments") {
          resolve(message.payload.files);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  subscribeToDocumentChange(filePath: string, callback: (newContent: string) => void): Unsubscribe {
    vscodeApi.postMessage({
      type: "subscribeToDocumentChange",
      payload: { filePath }
    });

    const listener = (message: VsCodeApiProxyMessageResponse) => {
      if (message.type === "onDocumentChange" && message.payload.filePath === filePath) {
        callback(message.payload.newContent);
      }
    }

    this.eventListeners.push(listener);
    return () => {
      this.removeListener(listener);
      vscodeApi.postMessage({ type: "unsubscribeToDocumentChange", payload: { filePath } })
    }
  }

  private removeListener(listener: ProxyResponseListener) {
    remove(this.eventListeners, listener)
  }
}
