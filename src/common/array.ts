export const remove = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
};

export const removeLast = (text: string, count: number) => {
  return text.substring(0, text.length - count);
};

export const range = (start: number, end: number) =>
  Array(end - start)
    .fill({})
    .map((_, i) => start + i);

export const repeat = <T>(count: number, value: T): T[] => Array(count).fill(value);
