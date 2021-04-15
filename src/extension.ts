import * as vscode from "vscode";
import { Panel } from "./panel";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("webgl-shader-viewer.show-viewer", () => {
      Panel.createOrShow(context.extensionUri);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(Panel.viewType, {
      async deserializeWebviewPanel(webviewPanel) {
        Panel.revive(webviewPanel, context.extensionUri);
      },
    });
  }
}

export function deactivate() {}
