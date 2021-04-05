import React from "react";

export const useForceRender = () => {
  const [, forceRender] = React.useReducer(s => s + 1, 0);
  return forceRender;
};
