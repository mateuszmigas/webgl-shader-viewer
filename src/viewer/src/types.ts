import { TupleOf } from "./utils/webgl/types";
export type Vector2Array = TupleOf<number, 2>;
export type Vector3Array = TupleOf<number, 3>;
export type Vector4Array = TupleOf<number, 4>;
export type Vector3 = { x: number; y: number; z: number };

export type Matrix3Array = TupleOf<number, 9>;
export type Matrix4Array = TupleOf<number, 16>;
