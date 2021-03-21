export const safeJSONParse = (value: string): any | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
