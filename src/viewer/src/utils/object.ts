export const objectMap = <T extends { [key: string]: any }>(
  object: T,
  map: (value: any, key: string) => any
) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = map(object[key], key);
    return result;
  }, {} as { [key: string]: any });
};
