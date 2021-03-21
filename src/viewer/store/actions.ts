import { CameraPosition } from "@utils/cameraManipulator";
import { DrawMode } from "@utils/webgl/index";

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
      payload: { name: string; type: number; optionId?: string; value?: any };
    }
  | {
      type: "SET_ATTRIBUTE_BUFFER_VALUE";
      payload: {
        name: string;
        type: number;
        value: string;
      };
    }
  | {
      type: "SET_ATTRIBUTE_BUFFER_OPTION";
      payload: {
        name: string;
        type: number;
        optionId: string;
      };
    }
  | {
      type: "SET_INDEX_BUFFER_VALUE";
      payload: {
        value: string;
      };
    }
  | {
      type: "SET_INDEX_BUFFER_OPTION";
      payload: {
        optionId: string;
      };
    }
  | {
      type: "SET_TEXTURE_VALUE";
      payload: { name: string; value: string };
    }
  | {
      type: "SET_TEXTURE_OPTION";
      payload: { name: string; optionId: string };
    }
  | {
      type: "SET_MESH";
      payload: { id: string };
    }
  | {
      type: "SET_DRAW_MODE";
      payload: { mode: DrawMode };
    }
  | {
      type: "SET_CAMERA_POSITION";
      payload: { position: CameraPosition };
    }
  | {
      type: "SET_VIWER_SIZE";
      payload: { size: { width: number; height: number } };
    };
