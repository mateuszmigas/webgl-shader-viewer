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
      type: "SET_ATTRIBUTE_BUFFER";
      payload: { name: string; type: number; value: string };
    }
  | {
      type: "UPADTE_COUNTER";
      payload: { value: number };
    };
