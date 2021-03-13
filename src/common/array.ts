export const remove = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
};

export const removeLast = (text: string, count: number) => {
  return text.substring(0, text.length - count);
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
