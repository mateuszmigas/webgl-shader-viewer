import * as vscode from "vscode";
const path = require("path");
import { MessageRequest, MessageResponse } from "./messages";

export const panelEndpoint = (
  postMessage: (message: MessageResponse) => void,
  disposables: vscode.Disposable[]
) => (message: MessageRequest) => {
  const didSaveTextDocumentWatchers = new Map<
    string,
    (fileContent: string) => void
  >();

  vscode.workspace.onDidSaveTextDocument(
    listener => {
      const watcher = didSaveTextDocumentWatchers.get(listener.fileName);
      watcher?.(listener.getText());
    },
    null,
    disposables
  );

  switch (message.type) {
    case "getShaderDocuments": {
      vscode.workspace.findFiles("**/*.glsl").then(documents => {
        postMessage({
          ...message,
          payload: {
            files: documents.map(sd => ({
              filePath: sd.fsPath,
              fileName: path.basename(sd.fsPath),
            })),
          },
        });
      });
      break;
    }
    case "getDocumentText": {
      vscode.workspace
        .openTextDocument(message.payload.fileName)
        .then(document => {
          postMessage({
            ...message,
            payload: {
              fileName: message.payload.fileName,
              text: document.getText(),
            },
          });
        });
      break;
    }
    case "subscribeToDocumentTextChange": {
      didSaveTextDocumentWatchers.set(
        message.payload.fileName,
        (newContent: string) => {
          postMessage({
            type: "onDocumentTextChange",
            payload: { filePath: message.payload.fileName, text: newContent },
          });
        }
      );
      break;
    }
    case "unsubscribeToDocumentTextChange": {
      didSaveTextDocumentWatchers.delete(message.payload.fileName);
      break;
    }
    default:
      break;
  }
};
