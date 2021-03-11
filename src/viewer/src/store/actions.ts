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
      type: "UPADTE_COUNTER";
      payload: { value: number };
    };
