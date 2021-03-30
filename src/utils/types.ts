export type TupleOf<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export type Vector2Array = TupleOf<number, 2>;
export type Vector3Array = TupleOf<number, 3>;
export type Vector4Array = TupleOf<number, 4>;
export type Vector3 = { x: number; y: number; z: number };
export type TextCoord = { u: number; v: number };

export type Matrix3Array = TupleOf<number, 9>;
export type Matrix4Array = TupleOf<number, 16>;
