// Types
import {
  Dictionary,
  RequestType,
  UploadType,
} from '../types';
import { Environment } from '../helpers/environment';

/**
 * Various request types enum.
 *
 * @enum
 */
export const REQUEST_TYPE = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  DELETE: 'delete',
} as Dictionary<RequestType>;

/**
 * Handler upload type.
 * 
 * @enum
 */
export const UPLOAD_TYPE = {
  NONE: 'none',
  SAVE: 'save',
} as Dictionary<UploadType>;

/**
 * Developmental URL.
 */
export const DEVELOPMENT_URL = `http://localhost:5173`;

/**
 * Production URL.
 */
export const PRODUCTION_URL = 'fieldsofmistria.app';

/**
 * File times for upload types.
 */
export const FILE_TYPES = {
  none: {},
  save: {
    'application/x-spss-sav': 'sav',
    'application/octet-stream': 'sav',
  },
} as Record<UploadType, Dictionary<string>>;

export const IS_WINDOWS = process.platform === 'win32';

export const EXECUTABLE_DIR = 'bin';
export const EXECUTABLE_NAME = 'vaultc-x86_64-pc-windows-msvc-v0.14.0.exe';

export const SAVE_DIR = 'saves';
export const UNPACKED_DIR = 'unpacked';

