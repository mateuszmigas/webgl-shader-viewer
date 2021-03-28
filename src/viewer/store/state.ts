import { ExtensionState } from "@extensionState";

export type ViewerState = ExtensionState & {
  viewerSize: { width: number; height: number };
};
