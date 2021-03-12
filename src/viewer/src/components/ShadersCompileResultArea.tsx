import React from "react";

export const ShadersCompileResultArea = (props: { errors: string }) => {
  return <div className="shader-compile-errors-area">{props.errors}</div>;
};
