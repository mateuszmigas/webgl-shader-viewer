import { remove } from "@utils/array";
import { uuidv4 } from "@utils/uuid";
import { ExtensionConfiguration } from "extensionConfiguration";
import { MessageResponse } from "./messages";
import { vscodeApi } from "./vscodeApi";

type ResponseListener = (message: MessageResponse) => void;

class ViewerEndpoint {
  eventListeners: ResponseListener[] = [];

  constructor() {
    window.addEventListener("message", event => {
      this.eventListeners.forEach(listener => listener(event.data));
    });
  }

  getWorkspaceFilesOfTypes(extensions: string[]) {
    const messageId = uuidv4();

    vscodeApi.postMessage({
      type: "getWorkspaceFilesOfTypes",
      id: messageId,
      payload: { extensions },
    });

    return new Promise<{ fileName: string; filePath: string; uri: string }[]>(resolve => {
      const listener = (message: MessageResponse) => {
        if (message.type === "getWorkspaceFilesOfTypes" && message.id === messageId) {
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
      const listener = (message: MessageResponse) => {
        if (message.type === "getDocumentText" && message.id === messageId) {
          resolve(message.payload.text);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  getImageBase64Data(filePath: string) {
    const messageId = uuidv4();

    vscodeApi.postMessage({
      type: "getImageBase64Data",
      id: messageId,
      payload: { filePath },
    });

    return new Promise<string>(resolve => {
      const listener = (message: MessageResponse) => {
        if (message.type === "getImageBase64Data" && message.id === messageId) {
          resolve(message.payload.base64Data);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  getExtensionFileUri(fileName: string) {
    const messageId = uuidv4();

    vscodeApi.postMessage({
      type: "getExtensionFileUri",
      id: messageId,
      payload: { fileName },
    });

    return new Promise<string>(resolve => {
      const listener = (message: MessageResponse) => {
        if (message.type === "getExtensionFileUri" && message.id === messageId) {
          resolve(message.payload.uri);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  getExtensionConfiguration() {
    vscodeApi.postMessage({
      type: "getExtensionConfiguration",
    });

    return new Promise<ExtensionConfiguration>(resolve => {
      const listener = (message: MessageResponse) => {
        if (message.type === "getExtensionConfiguration") {
          resolve(message.payload.config);
          this.removeListener(listener);
        }
      };

      this.eventListeners.push(listener);
    });
  }

  subscribeToDocumentSave(filePath: string, callback: (newContent: string) => void): () => void {
    vscodeApi.postMessage({
      type: "subscribeToDocumentTextChange",
      payload: { fileName: filePath },
    });

    const listener = (message: MessageResponse) => {
      if (message.type === "onDocumentTextChange" && message.payload.filePath === filePath) {
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

  showWebViewDevTools() {
    vscodeApi.postMessage({
      type: "showWebViewDevTools",
    });
  }

  private removeListener(listener: ResponseListener) {
    remove(this.eventListeners, listener);
  }
}

export const viewerEndpoint = new ViewerEndpoint();
