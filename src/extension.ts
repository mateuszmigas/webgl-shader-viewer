import * as vscode from "vscode";
import { ViewerPanel } from "./viewerPanel";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("webgl-shader-viewer.show-viewer", () => {
      ViewerPanel.createOrShow(context.extensionUri);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(ViewerPanel.viewType, {
      async deserializeWebviewPanel(webviewPanel, state) {
        ViewerPanel.revive(webviewPanel, context.extensionUri);
      },
    });
  }
}

export function deactivate() { }
