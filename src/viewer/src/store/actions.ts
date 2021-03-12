import { Matrix4Array } from "./../types";

export type ViewerAction =
  | {
      type: "SET_VERTEX_FILE_PATH";
      payload: { path: string | null };
    }
  | {
      type: "SET_FRAGMENT_FILE_PATH";
      payload: { path: string | null };
    }
  | {
      type: "SET_UNIFORM";
      payload: { name: string; type: number; value: string };
    }
  | {
      type: "SET_ATTRIBUTE_BUFFER";
      payload: { name: string; type: number; value: string };
    }
  | {
      type: "SET_TEXTURE";
      payload: { name: string; optionId: string; optionValue: string };
    }
  | {
      type: "SET_MESH";
      payload: { id: string };
    }
  | {
      type: "SET_CAMERA_POSITION";
      payload: { position: Matrix4Array };
    }
  | {
      type: "UPADTE_COUNTER";
      payload: { value: number };
    };
