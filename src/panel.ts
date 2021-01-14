import * as vscode from "vscode";
import { panelEndpoint } from "./communication/panelEndpoint";

export class Panel {
  private static instance: Panel | undefined;
  private disposables: vscode.Disposable[] = [];
  public static readonly viewType = "webglshaderviewer";

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (Panel.instance) {
      Panel.instance.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      Panel.viewType,
      "WebGL Shader Viewer",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      }
    );

    Panel.instance = new Panel(panel, extensionUri);
  }

  static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    Panel.instance = new Panel(panel, extensionUri);
  }

  private constructor(
    private panel: vscode.WebviewPanel,
    private extensionUri: vscode.Uri
  ) {
    this.panel.webview.html = this._getHtmlForWebview();
    const listener = panelEndpoint(
      msg => this.panel.webview.postMessage(msg),
      this.disposables
    );
    this.panel.webview.onDidReceiveMessage(listener, null, this.disposables);
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public dispose() {
    this.panel.dispose();
    this.disposables.forEach(d => d.dispose());
    this.disposables.length = 0;
    Panel.instance = undefined;
  }

  private _getHtmlForWebview() {
    const webview = this.panel.webview;

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "main.js")
    );

    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "styles.css")
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
  
              <!--
                  Use a content security policy to only allow loading images from https or from our extension directory,
                  and only allow scripts that have a specific nonce.
              -->
              <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
  
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
              <link href="${stylesUri}" rel="stylesheet">
              <title>No name</title>
          </head>
          <body>
              <div id="viewer"></div>
              <script nonce="${nonce}" src="${scriptUri}"></script>
          </body>
          </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
