module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const panel_1 = __webpack_require__(2);
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("webgl-shader-viewer.show-viewer", () => {
        panel_1.Panel.createOrShow(context.extensionUri);
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(panel_1.Panel.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    panel_1.Panel.revive(webviewPanel, context.extensionUri);
                });
            },
        });
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
const vscode = __importStar(__webpack_require__(1));
const panelEndpoint_1 = __webpack_require__(3);
class Panel {
    constructor(panel, extensionUri) {
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.disposables = [];
        this.panel.webview.html = this._getHtmlForWebview();
        const listener = panelEndpoint_1.panelEndpoint(this.panel.webview, extensionUri, this.disposables);
        this.panel.webview.onDidReceiveMessage(listener, null, this.disposables);
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (Panel.instance) {
            Panel.instance.panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(Panel.viewType, "WebGL Shader Viewer", column || vscode.ViewColumn.One, {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
        });
        Panel.instance = new Panel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        Panel.instance = new Panel(panel, extensionUri);
    }
    dispose() {
        this.panel.dispose();
        this.disposables.forEach(d => d.dispose());
        this.disposables.length = 0;
        Panel.instance = undefined;
    }
    _getHtmlForWebview() {
        const webview = this.panel.webview;
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", "main.js"));
        const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", "styles.css"));
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
exports.Panel = Panel;
Panel.viewType = "webglshaderviewer";
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panelEndpoint = void 0;
const vscode = __importStar(__webpack_require__(1));
const path = __webpack_require__(4);
const panelEndpoint = (webView, extensionUri, disposables) => {
    const postMessage = (msg) => webView.postMessage(msg);
    const getUri = (fileName) => webView.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", fileName));
    return (message) => {
        const didSaveTextDocumentWatchers = new Map();
        vscode.workspace.onDidSaveTextDocument(listener => {
            const watcher = didSaveTextDocumentWatchers.get(listener.fileName);
            watcher === null || watcher === void 0 ? void 0 : watcher(listener.getText());
        }, null, disposables);
        switch (message.type) {
            case "showWebViewDevTools": {
                vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
                break;
            }
            case "getWorkspaceFilesOfTypes": {
                vscode.workspace
                    .findFiles(`**/*.{${message.payload.extensions.join(",")}}`)
                    .then(documents => {
                    postMessage(Object.assign(Object.assign({}, message), { payload: {
                            files: documents.map(sd => {
                                return {
                                    uri: webView.asWebviewUri(sd).toString(),
                                    filePath: sd.fsPath,
                                    fileName: path.basename(sd.fsPath),
                                };
                            }),
                        } }));
                });
                break;
            }
            case "getDocumentText": {
                vscode.workspace
                    .openTextDocument(message.payload.fileName)
                    .then(document => {
                    postMessage(Object.assign(Object.assign({}, message), { payload: {
                            fileName: message.payload.fileName,
                            text: document.getText(),
                        } }));
                });
                break;
            }
            case "getExtensionFileUri": {
                const uri = getUri(message.payload.fileName);
                postMessage(Object.assign(Object.assign({}, message), { payload: { uri: uri.toString() } }));
                break;
            }
            case "subscribeToDocumentTextChange": {
                didSaveTextDocumentWatchers.set(message.payload.fileName, (newContent) => {
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
exports.panelEndpoint = panelEndpoint;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map