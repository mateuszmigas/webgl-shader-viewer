import React from "react";
import { viewerEndpoint } from "../../../../common/communication/viewerEndpoint";

export const useDocumentWatcher = (filePath: string, onChange: (fileText: string) => void) => {
  React.useEffect(() => {
    const unsubscribe = viewerEndpoint.subscribeToDocumentSave(filePath, onChange);
    viewerEndpoint.getDocumentText(filePath).then(onChange);
    return () => unsubscribe();
  }, [filePath]);
};
