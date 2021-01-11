import { remove } from "./../utils/array";
import { uuidv4 } from "./../utils/uuid";
declare const acquireVsCodeApi: () => {
  //getState: () => any;
  //setState: (state: any) => void;
  postMessage: (message: VsCodeApiProxyMessageRequest) => void;
};
export const vscodeApi = acquireVsCodeApi();

export type VsCodeApiProxyMessageRequest =
  | { type: "getShaderDocuments"; id: string }
  | { type: "getDocumentText"; id: string; payload: { fileName: string } }
  | { type: "subscribeToDocumentTextChange"; payload: { fileName: string } }
  | { type: "unsubscribeToDocumentTextChange"; payload: { fileName: string } };

export type VsCodeApiProxyMessageResponse =
  | {
      type: "getShaderDocuments";
      id: string;
      payload: { files: { filePath: string; fileName: string }[] };
    }
  | {
      type: "getDocumentText";
      id: string;
      payload: { fileName: string; text: string };
    }
  | {
      type: "onDocumentTextChange";
      payload: { filePath: string; text: string };
    };

export type Unsubscribe = () => void;

type ProxyResponseListener = (message: VsCodeApiProxyMessageResponse) => void;

export class VsCodeApiProxy {
  eventListeners: ProxyResponseListener[] = [];

  constructor() {
    window.addEventListener("message", event => {
      this.eventListeners.forEach(listener => listener(event.data));
    });
  }

  getShaderDocuments() {
    const messageId = uuidv4();

    vscodeApi.postMessage({
      type: "getShaderDocuments",
      id: messageId,
    });

    return new Promise<{ filePath: string; fileName: string }[]>(resolve => {
      const listener = (message: VsCodeApiProxyMessageResponse) => {
        if (message.type === "getShaderDocuments" && message.id === messageId) {
          resolve(message.payload.files);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  getDocumentText(fileName: string) {
    const messageId = uuidv4();

    vscodeApi.postMessage({
      type: "getDocumentText",
      id: messageId,
      payload: { fileName },
    });

    return new Promise<string>(resolve => {
      const listener = (message: VsCodeApiProxyMessageResponse) => {
        if (message.type === "getDocumentText" && message.id === messageId) {
          resolve(message.payload.text);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  subscribeToDocumentSave(
    filePath: string,
    callback: (newContent: string) => void
  ): Unsubscribe {
    vscodeApi.postMessage({
      type: "subscribeToDocumentTextChange",
      payload: { fileName: filePath },
    });

    const listener = (message: VsCodeApiProxyMessageResponse) => {
      if (
        message.type === "onDocumentTextChange" &&
        message.payload.filePath === filePath
      ) {
        callback(message.payload.text);
      }
    };

    this.eventListeners.push(listener);
    return () => {
      this.removeListener(listener);
      vscodeApi.postMessage({
        type: "unsubscribeToDocumentTextChange",
        payload: { fileName: filePath },
      });
    };
  }

  private removeListener(listener: ProxyResponseListener) {
    remove(this.eventListeners, listener);
  }
}
