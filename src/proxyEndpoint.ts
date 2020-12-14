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
    default:
      break;
  }
};
