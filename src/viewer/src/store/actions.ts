export type ViewerAction =
  | {
      type: "SET_VERTEX_FILE_PATH";
      payload: { path: string | null };
    }
  | {
      type: "UPADTE_COUNTER";
      payload: { value: number };
    };
