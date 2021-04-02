export const remove = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
};

export const range = (range: number | [number, number]) => {
  if (Array.isArray(range))
    return Array(range[1] - range[0])
      .fill({})
      .map((_, i) => range[0] + i);
  else {
    return Array(range)
      .fill({})
      .map((_, i) => i);
  }
};

export const repeat = <T>(count: number, value: T): T[] => Array(count).fill(value);

export const repeat4Times = <T>(array: T[]) => {
  return [].concat(array, array, array, array);
};

export const convertArrayToObject = <T, R>(
  array: T[],
  map: (item: T) => [string, R]
): { [key: string]: R } => {
  const initialValue = {};
  return array.reduce((accumulator, item) => {
    const [key, value] = map(item);
    accumulator[key] = value;
    return accumulator;
  }, initialValue as { [key: string]: R });
};
