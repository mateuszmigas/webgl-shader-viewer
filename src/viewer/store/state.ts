import { ExtensionState } from "@extensionState";

export type ViewerState = ExtensionState & {
  viewerSize: { width: number; height: number };
  userWorkspace: {
    imageOptions: { id: string; display: string }[];
    shaderOptions: { id: string; display: string }[];
  };
};
