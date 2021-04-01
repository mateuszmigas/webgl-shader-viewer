//todo strongly typed
export const objectMap = <T extends { [key: string]: any }>(
  object: T,
  map: (value: any, key: string) => any
) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = map(object[key], key);
    return result;
  }, {} as { [key: string]: any });
};

export const anyPropChanged = <T>(left: T, right: T, props: (keyof T)[]) =>
  props.some(p => left?.[p] !== right?.[p]);

export const shallowEqual = <T extends object>(left: T, right: T) => {
  const keys = Object.keys(left);
  const leftObj = left as { [key: string]: unknown };
  const rightObj = right as { [key: string]: unknown };

  if (keys.length !== Object.keys(right).length) {
    return false;
  }

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    if (leftObj[key] !== rightObj[key]) return false;
  }

  return true;
};
