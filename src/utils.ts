export const remove = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
};

export const removeLast = (text: string, count: number) => {
  return text.substring(0, text.length - count);
};

//https://stackoverflow.com/a/2117523
export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const hasProperty = <T extends {}, P extends PropertyKey>(
  obj: T,
  prop: P
): obj is T & Record<P, unknown> => {
  return obj.hasOwnProperty(prop);
};
