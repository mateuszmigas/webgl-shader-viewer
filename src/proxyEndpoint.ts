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
  const requestShaderDocuments = () => {
    const shaderDocuments = vscode.window.visibleTextEditors.filter((td) =>
      path.extname(td.document.fileName, ".glsl")
    );
    return shaderDocuments.map((sd) => ({
      filePath: sd.document.fileName,
      fileName: path.basename(sd.document.fileName),
    }));
  };

  switch (message.type) {
    case "getShaderDocuments": {
      postMessage({
        type: "getShaderDocuments",
        payload: {
          files: requestShaderDocuments(),
        },
      });
      break;
    }
    case "onDidShaderDocumentsChange": {
      //wrong
      vscode.workspace.onDidChangeWorkspaceFolders(
        (e) => {
          console.log("docs changed");

          postMessage({
            type: "onDidShaderDocumentsChange",
            payload: {
              files: requestShaderDocuments(),
            },
          });
        },
        null,
        disposables
      );
      break;
    }
    default:
      break;
  }
};
