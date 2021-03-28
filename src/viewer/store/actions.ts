import { CameraPosition } from "@utils/cameraManipulator";
import { DrawMode } from "@utils/webgl/index";
import { AttributeBufferType } from "@utils/webgl/attributeBuffer/attributeBuffer";
import { UniformType } from "@utils/webgl/uniform/uniform";

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
      type: "REBUILD_SHADER_INFO";
      payload: {
        attributeBuffersInfos: { name: string; type: AttributeBufferType }[];
        uniformInfos: { name: string; type: UniformType }[];
        texturesInfos: { name: string }[];
      };
    }
  | {
      type: "SET_UNIFORM_VALUE";
      payload: { name: string; type: number; value: any };
    }
  | {
      type: "SET_UNIFORM_OPTION";
      payload: { name: string; type: number; optionId: string };
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
      type: "SET_TEXTURE_LOADING_ERROR";
      payload: {
        name: string;
        error: string;
      };
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
