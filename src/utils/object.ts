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

const areEqual = <T extends any>(left: T, right: T, deep: boolean) => {
  if (left === right) return true;

  const keys = Object.keys(left);
  const leftObj = left as { [key: string]: any };
  const rightObj = right as { [key: string]: any };

  if (keys.length !== Object.keys(right).length) {
    return false;
  }

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const leftValue = leftObj[key];
    const rightValue = rightObj[key];

    if ((!deep && leftValue !== rightValue) || !deepEqual(leftValue, rightValue)) {
      return false;
    }
  }

  return true;
};

export const shallowEqualArrays = <T extends any[]>(left: T, right: T) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

export const shallowEqual = <T extends object>(left: T, right: T) => areEqual(left, right, false);
export const deepEqual = <T extends object>(left: T, right: T) => areEqual(left, right, true);
