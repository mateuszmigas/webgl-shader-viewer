export type MessageRequest =
  | { type: "getShaderDocuments"; id: string }
  | { type: "getDocumentText"; id: string; payload: { fileName: string } }
  | { type: "subscribeToDocumentTextChange"; payload: { fileName: string } }
  | { type: "unsubscribeToDocumentTextChange"; payload: { fileName: string } };

export type MessageResponse =
  | {
      type: "getShaderDocuments";
      id: string;
      payload: { files: { filePath: string; fileName: string }[] };
    }
  | {
      type: "getDocumentText";
      id: string;
      payload: { fileName: string; text: string };
    }
  | {
      type: "onDocumentTextChange";
      payload: { filePath: string; text: string };
    };
