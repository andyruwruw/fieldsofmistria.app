/**
 * Converts an array of objects into a record (object) with the object's id as the key.
 *
 * @param {T[]} - The array to convert.
 * @returns {Record<string, T>} - The converted object.
 */
export const convertArrayToObjectWithIds = <T>(array: T[]): Record<string, T> => {
  const obj = {} as Record<string, T>;

  array.forEach((item) => {
    if (item && typeof item === 'object' && 'id' in item) {
      obj[item.id as unknown as string] = item;
    }
  });

  return obj;
}

/**
 * Converts a tesserae string to a number.
 *
 * @param {string} tesserae - The string representing tesserae, e.g., "1,000t".
 * @param {number} [defaultValue=0] - The default value to return if parsing fails.
 * @returns {number} The numeric value of the tesserae.
 */
export const convertTesseraeString = (
  tesserae: string,
  defaultValue: number = 0,
): number => {
  const TESSERAE_REGEX = /([\d,]+)t/;
  const match = tesserae.match(TESSERAE_REGEX);

  const number = match ? match[1] : '';

  return parseInt(
    number.replace(/,/g, ''), // Remove commas for parsing
    10,
  ) || defaultValue;
}

/**
 * Normalizes a string to a specified length by truncating or padding it.
 *
 * @param {string} str - The string to normalize.
 * @param {number} length - The desired length of the string.
 * @returns {string} The normalized string.
 */
export const normalizeStringLength = (
  str: string,
  length: number,
): string => {
  if (str.length > length) {
    return str.slice(0, length);
  }

  return str.padEnd(length);
}