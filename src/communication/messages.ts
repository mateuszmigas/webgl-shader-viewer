import { ExtensionConfiguration } from "./../extensionConfiguration";
export type MessageRequest =
  | {
      type: "getWorkspaceFilesOfTypes";
      id: string;
      payload: { extensions: string[] };
    }
  | { type: "getDocumentText"; id: string; payload: { fileName: string } }
  | { type: "getImageBase64Data"; id: string; payload: { filePath: string } }
  | { type: "getExtensionFileUri"; id: string; payload: { fileName: string } }
  | { type: "subscribeToDocumentTextChange"; payload: { fileName: string } }
  | { type: "unsubscribeToDocumentTextChange"; payload: { fileName: string } }
  | { type: "getExtensionConfiguration" }
  | { type: "showWebViewDevTools" };

export type MessageResponse =
  | {
      type: "getWorkspaceFilesOfTypes";
      id: string;
      payload: { files: { fileName: string; filePath: string; uri: string }[] };
    }
  | {
      type: "getDocumentText";
      id: string;
      payload: { fileName: string; text: string };
    }
  | {
      type: "getImageBase64Data";
      id: string;
      payload: { base64Data: string };
    }
  | {
      type: "getExtensionFileUri";
      id: string;
      payload: { uri: string };
    }
  | {
      type: "getExtensionConfiguration";
      payload: { config: ExtensionConfiguration };
    }
  | {
      type: "onDocumentTextChange";
      payload: { filePath: string; text: string };
    };
