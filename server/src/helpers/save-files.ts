// Packages
import {
  readdir,
  readFile,
} from 'node:fs/promises';
import { execSync  } from 'child_process';
import path from 'path';

// Local Imports
import {
  EXECUTABLE_DIR,
  EXECUTABLE_NAME,
  IS_WINDOWS,
  SAVE_DIR,
  UNPACKED_DIR,
} from '../config';
import { Monitor } from './monitor';

/**
 * Unpacks a save file.
 *
 * @param filename Name of the file to unpack.
 */
export const unpack = async (filename: string) => {
  try {
    const executablePath = path.join(EXECUTABLE_DIR, EXECUTABLE_NAME);
    const savePath = path.join(SAVE_DIR, filename);
    const exportPath = path.join(UNPACKED_DIR, `${filename}`);

    if (IS_WINDOWS) {
      await execSync(`${executablePath} unpack ${savePath} ${exportPath}`).toString();
    } else {
      await execSync(`xvfb-run wine ${executablePath} unpack ${savePath} ${exportPath}`).toString();
    }

    const destroyPromises = [];
    
    destroyPromises.push(destroy(savePath));

    const data = await combineJsons(exportPath);

    destroyPromises.push(destroy(
      exportPath,
      false,
    ));

    await Promise.all(destroyPromises);

    return data;
  } catch (error) {
    Monitor.log(
      'Save Unpack',
      `${error}`,
      Monitor.Layer.WARNING,
    );
  }
}

/**
 * Destroys a save file.
 *
 * @param {string} filePath Name of the file to destroy.
 * @returns {Promise<void>} Promise of the action.
 */
export const destroy = async (
  filePath: string,
  file: boolean = true,
) => {
  try {
    if (IS_WINDOWS) {
      if (file) {
        await execSync(`del ${filePath}`).toString();
      } else {
        await execSync(`rmdir /s /q ${filePath}`).toString();
      }
    } else {
      await execSync(`rm -rf ${filePath}`).toString();
    }
  } catch (error) {
    Monitor.log(
      'Save Delete',
      `${error}`,
      Monitor.Layer.WARNING,
    );
  }
}

/**
 * Combines multiple JSON files into a single object.
 *
 * @param {string} directory Directory to combine JSON files from.
 * @returns {Promise<Record<string, any>>} Combined JSON object.
 */
export const combineJsons = async (directory: string): Promise<Record<string, any>> => {
  const files = await readdir(directory);
  const jsonFiles = files.filter((file) => (file.endsWith('.json')));

  const combined: Record<string, any> = {};

  for (const file of jsonFiles) {
    const name = path.basename(
      file,
      '.json',
    );
    const content = JSON.parse(await readFile(
      path.join(directory, file),
      'utf-8',
    ));

    combined[name] = content || {};
  }

  return combined;
}