// Packages
import fs from 'fs';

/**
 * Writes data to a JSON file.
 *
 * @param {string} path - The file path to write the JSON data to.
 * @param {any} data - The data to write to the JSON file.
 */
const writeToJson = (
  path: string,
  data: any,
): void => {
  const json = JSON.stringify(
    data, 
    null,
    2,
  );

  return fs.writeFileSync(
    path,
    json,
    'utf8',
  );
};

export default writeToJson;
