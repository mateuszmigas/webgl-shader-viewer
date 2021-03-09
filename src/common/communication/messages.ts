export type MessageRequest =
  | {
      type: "getWorkspaceFilesOfTypes";
      id: string;
      payload: { extensions: string[] };
    }
  | { type: "getDocumentText"; id: string; payload: { fileName: string } }
  | { type: "getExtensionFileUri"; id: string; payload: { fileName: string } }
  | { type: "subscribeToDocumentTextChange"; payload: { fileName: string } }
  | { type: "unsubscribeToDocumentTextChange"; payload: { fileName: string } }
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
      type: "getExtensionFileUri";
      id: string;
      payload: { uri: string };
    }
  | {
      type: "onDocumentTextChange";
      payload: { filePath: string; text: string };
    };
