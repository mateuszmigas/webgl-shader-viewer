import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("webgl-shader-viewer.show-viewer", () => {
      ViewerPanel.createOrShow(context.extensionUri);
      vscode.window.showInformationMessage(
        "Hello World from WebGL Shader Viewer!"
      );
    })
  );
}

export function deactivate() {}

class ViewerPanel {
  private static instance: ViewerPanel | undefined;
  private disposables: vscode.Disposable[] = [];
  public static readonly viewType = "catCoding";

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ViewerPanel.instance) {
      ViewerPanel.instance.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "webglshaderviewer",
      "WebGL Shader Viewer",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      }
    );

    ViewerPanel.instance = new ViewerPanel(panel, extensionUri);
  }

  private constructor(
    private panel: vscode.WebviewPanel,
    private extensionUri: vscode.Uri
  ) {
    this.panel.webview.html = this._getHtmlForWebview();
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public dispose() {
    this.panel.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.disposables.length = 0;
    ViewerPanel.instance = undefined;
  }

  private _getHtmlForWebview() {
    const webview = this.panel.webview;
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.joinPath(
      this.extensionUri,
      "media",
      "main.js"
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Local path to css styles
    // const styleResetPath = vscode.Uri.joinPath(
    //   this.extensionUri,
    //   "media",
    //   "reset.css"
    // );
    // const stylesPathMainPath = vscode.Uri.joinPath(
    //   this.extensionUri,
    //   "media",
    //   "vscode.css"
    // );

    // Uri to load styles into webview
    //const stylesResetUri = webview.asWebviewUri(styleResetPath);
    //const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

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


			<title>Cat Coding</title>
		</head>
		<body>
			<div id="viewer-host"></div>
			<div>cycki</div>
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
