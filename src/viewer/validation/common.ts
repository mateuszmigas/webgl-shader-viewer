import { translations } from "@common/translations";
import { safeJSONParse } from "@utils/parsing";

export const validateArrayElements = (value: string) => {
  const parsedResult = safeJSONParse(value);

  if (parsedResult === null) {
    return translations.errors.parsing.invalidJsonFormat;
  } else {
    const parsedResult = JSON.parse(value);
    if (!Array.isArray(parsedResult)) {
      return translations.errors.parsing.notArray;
    } else {
      const distinctElementSizes = new Set(
        parsedResult.map(item => (Array.isArray(item) ? item.length : 1))
      );
      if (distinctElementSizes.size > 1) {
        return translations.errors.parsing.notEveryArrayElementSameSize;
      }
    }
  }

  return "";
};
