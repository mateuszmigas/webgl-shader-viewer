export const validateArrayElements = (value: string, elementSize: number) => {
  try {
    const parsedResult = JSON.parse(value);
    if (!Array.isArray(parsedResult)) {
      return "this is not an array type";
    } else {
      const isEveryElementCorrectSize = parsedResult.every(item =>
        Array.isArray(item) ? item.length === elementSize : elementSize === 1
      );
      if (!isEveryElementCorrectSize) {
        return "not every element id the arra is same size";
      }
    }
  } catch {
    return "this is not a valid format";
  }

  return "";
};
