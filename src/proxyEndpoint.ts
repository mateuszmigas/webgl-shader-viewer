import * as vscode from "vscode";
const path = require("path");
import {
  VsCodeApiProxyMessageRequest,
  VsCodeApiProxyMessageResponse,
} from "./viewer/communicationProxy";

export const proxyEndpoint = (
  postMessage: (message: VsCodeApiProxyMessageResponse) => void,
  disposables: vscode.Disposable[]
) => (message: VsCodeApiProxyMessageRequest) => {
  //   path.extname(td.document.fileName, ".glsl")
  // );
  // return shaderDocuments.map((sd) => ({
  //   filePath: sd.document.fileName,
  //   fileName: path.basename(sd.document.fileName),
  // }));

  const didSaveTextDocumentWatchers = new Map<string, (fileContent: string) => void>();

  vscode.workspace.onDidSaveTextDocument(listener => {
    const watcher = didSaveTextDocumentWatchers.get(listener.fileName);
    watcher?.(listener.getText());
  }, null, disposables);

  switch (message.type) {
    case "getShaderDocuments": {
      vscode.workspace.findFiles("**/*.glsl").then((documents) => {
        postMessage({
          type: "getShaderDocuments",
          payload: {
            files: documents.map((sd) => ({
              filePath: sd.fsPath,
              fileName: path.basename(sd.fsPath),
            })),
          },
        });
      });
      break;
    }
    case "subscribeToDocumentChange": {
      didSaveTextDocumentWatchers.set(message.payload.filePath, (newContent: string) => {
        postMessage({
          type: "onDocumentChange",
          payload: { filePath: message.payload.filePath, newContent }
        })
      });
      break;
    }
    case "unsubscribeToDocumentChange": {
      didSaveTextDocumentWatchers.delete(message.payload.filePath);
      break;
    }
    default:
      break;
  }
};
