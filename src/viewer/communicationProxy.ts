import { vscodeApi } from "./vscodeApi";
import * as vscode from "vscode";

export type VsCodeApiProxyMessageRequest =
  | { type: "getVisibleTextEditors" }
  | {
      type: "getSavedTextDocumentContent";
      payload: { fileName: string };
    };

export type VsCodeApiProxyMessageResponse =
  | {
      type: "getVisibleTextEditors";
      payload: { fileNames: string[] };
    }
  | {
      type: "onDidSaveTextDocument";
      payload: { fileName: string };
    }
  | {
      type: "getSavedTextDocumentContent";
      payload: { content: string };
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

  getVisibleTextEditors() {
    vscodeApi.postMessage({
      type: "getVisibleTextEditors",
    });

    return new Promise<string[]>((resolve) => {
      this.eventListeners.push((message) => {
        console.log("on message", message);

        if (message.type === "getVisibleTextEditors") {
          console.log("webview", message.payload);

          resolve(message.payload.fileNames);
          return true;
        }
        return false;
      });
    });
  }
}
