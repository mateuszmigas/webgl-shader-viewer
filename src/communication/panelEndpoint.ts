import * as vscode from "vscode";
import path from "path";
import { MessageRequest, MessageResponse } from "./messages";

export const panelEndpoint = (
  webView: vscode.Webview,
  extensionUri: vscode.Uri,
  disposables: vscode.Disposable[]
) => {
  const postMessage = (msg: MessageResponse) => webView.postMessage(msg);
  const getMediaUri = (fileName: string) =>
    webView.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", fileName));

  return (message: MessageRequest) => {
    const didSaveTextDocumentWatchers = new Map<string, (fileContent: string) => void>();

    vscode.workspace.onDidSaveTextDocument(
      listener => {
        const watcher = didSaveTextDocumentWatchers.get(listener.fileName);
        watcher?.(listener.getText());
      },
      null,
      disposables
    );

    switch (message.type) {
      case "showWebViewDevTools": {
        vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
        break;
      }
      case "getWorkspaceFilesOfTypes": {
        vscode.workspace
          .findFiles(`**/*.{${message.payload.extensions.join(",")}}`)
          .then(documents => {
            postMessage({
              ...message,
              payload: {
                files: documents.map(sd => {
                  return {
                    uri: webView.asWebviewUri(sd).toString(),
                    filePath: sd.fsPath,
                    fileName: path.basename(sd.fsPath),
                  };
                }),
              },
            });
          });
        break;
      }
      case "getDocumentText": {
        vscode.workspace.openTextDocument(message.payload.fileName).then(document => {
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
      case "getImageBase64Data": {
        const type = path.extname(message.payload.filePath).replace(".", "").toLowerCase();
        vscode.workspace.fs.readFile(vscode.Uri.file(message.payload.filePath)).then(data => {
          postMessage({
            ...message,
            payload: {
              base64Data: `data:image/${type};base64, ${Buffer.from(data).toString("base64")}`,
            },
          });
        });
        break;
      }
      case "getExtensionFileUri": {
        const uri = getMediaUri(message.payload.fileName);
        postMessage({
          ...message,
          payload: { uri: uri.toString() },
        });
        break;
      }
      case "getExtensionConfiguration": {
        const configuration = vscode.workspace.getConfiguration("webglShaderViewer");
        const renderingContext =
          configuration.get("renderingContext") === "WebGL2" ? "WebGL2" : "WebGL";

        postMessage({
          ...message,
          payload: {
            config: {
              renderingContext,
            },
          },
        });
        break;
      }
      case "subscribeToDocumentTextChange": {
        didSaveTextDocumentWatchers.set(message.payload.fileName, (newContent: string) => {
          postMessage({
            type: "onDocumentTextChange",
            payload: { filePath: message.payload.fileName, text: newContent },
          });
        });
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
};
