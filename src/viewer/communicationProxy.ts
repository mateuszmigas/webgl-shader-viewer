declare const acquireVsCodeApi: () => {
  //getState: () => any;
  //setState: (state: any) => void;
  postMessage: (message: VsCodeApiProxyMessageRequest) => void;
};
export const vscodeApi = acquireVsCodeApi();

export type VsCodeApiProxyMessageRequest =
  | { type: "getShaderDocuments" }
  | { type: "onDidShaderDocumentsChange" };

export type VsCodeApiProxyMessageResponse =
  | {
      type: "getShaderDocuments";
      payload: { files: { filePath: string; fileName: string }[] };
    }
  | {
      type: "onDidShaderDocumentsChange";
      payload: { files: { filePath: string; fileName: string }[] };
    };

export class VsCodeApiProxy {
  eventListeners: ((message: VsCodeApiProxyMessageResponse) => boolean)[] = [];

  constructor() {
    window.addEventListener("message", (event) => {
      //clear event listener that are no longer interested
      this.eventListeners = this.eventListeners.filter((listener) =>
        listener(event.data)
      );
    });
  }

  getShaderDocuments() {
    vscodeApi.postMessage({
      type: "getShaderDocuments",
    });

    return new Promise<{ filePath: string; fileName: string }[]>((resolve) => {
      this.eventListeners.push((message) => {
        if (message.type === "getShaderDocuments") {
          resolve(message.payload.files);
          return true;
        }
        return false;
      });
    });
  }

  onDidShaderDocumentsChange(
    callback: (documents: { filePath: string; fileName: string }[]) => void
  ) {
    vscodeApi.postMessage({
      type: "onDidShaderDocumentsChange",
    });

    this.eventListeners.push((message) => {
      if (message.type === "onDidShaderDocumentsChange") {
        callback(message.payload.files);
      }
      return false;
    });
  }
}
