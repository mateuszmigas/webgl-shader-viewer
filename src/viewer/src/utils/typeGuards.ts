export const hasProperty = <T extends {}, P extends PropertyKey>(
  obj: T,
  prop: P
): obj is T & Record<P, unknown> => {
  return obj.hasOwnProperty(prop);
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
};
