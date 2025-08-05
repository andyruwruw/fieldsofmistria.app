// Packages
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'node:path';
import fs from 'fs';

// Local Imports
import {
  FILE_TYPES,
  UPLOAD_TYPE,
} from '../config';
import { Monitor } from './monitor';

/**
 * Uploads a file using multer.
 *
 * @returns {multer.Multer} Multer instance configured for file uploads.
 */
export const upload = multer({
  storage: multer.diskStorage({
      destination: `./saves`,
      filename: (
        req,
        file,
        callback,
      ) => {
        const filename = uuidv4();
        const extension = FILE_TYPES[UPLOAD_TYPE.SAVE][file.mimetype];

        file.originalname = `${filename}.${extension}`;

        callback(
          null,
          `${filename}.${extension}`,
        );
      },
  }),
  fileFilter: (
    req,
    file,
    cb,
  ) => {
    cb(
      null,
      !!FILE_TYPES[UPLOAD_TYPE.SAVE][file.mimetype],
    );
  },
});

export const uploadFile = async (file: Express.Multer.File): Promise<boolean> => {
  try {
    const fileDirectory = `./saves`;

    if (!fs.existsSync(fileDirectory)) {
      return false;
    }

    await fs.writeFileSync(
      path.join(
        fileDirectory,
        file.filename,
      ),
      file.buffer,
    );

    return true;
  } catch (error) {
    Monitor.log(
      'Upload',
      `${error}`,
      Monitor.Layer.WARNING,
    );
  }

  return false;
}

