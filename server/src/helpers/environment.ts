// Packages
import * as dotenv from 'dotenv';
import {
  DEVELOPMENT_URL,
  PRODUCTION_URL,
} from '../config';

// Setting up DotEnv
dotenv.config();

/**
 * Static methods for retrieving environment variables.
 *
 * @static
 */
export class Environment {
  /**
   * Retrieves the port the server should run on.
   *
   * @default 3000
   * @returns {number} Server port.
   */
  static getServerPort(): number {
    return (parseInt(`${process.env.SERVER_PORT}`, 10) as number) || 3000;
  }

  /**
   * Whether log layer DEBUG is enabled.
   *
   * @default false
   * @returns {boolean} Whether log layer DEBUG is enabled.
   */
  static isDebugLayerEnabled(): boolean {
    return process.env.ENABLE_DEBUG_LAYER === 'true';
  }

  /**
   * Whether log layer PROGRESS is enabled.
   *
   * @default false
   * @returns {boolean} Whether log layer PROGRESS is enabled.
   */
  static isProgressLayerEnabled(): boolean {
    return process.env.ENABLE_PROGRESS_LAYER === 'true';
  }

  /**
   * Whether log layer SUCCESS is enabled.
   *
   * @default false
   * @returns {boolean} Whether log layer SUCCESS is enabled.
   */
  static isSuccessLayerEnabled(): boolean {
    return process.env.ENABLE_SUCCESS_LAYER === 'true';
  }

  /**
   * Whether log layer UPDATE is enabled.
   *
   * @default false
   * @returns {boolean} Whether log layer UPDATE is enabled.
   */
  static isUpdateLayerEnabled(): boolean {
    return process.env.ENABLE_UPDATE_LAYER === 'true';
  }

  /**
   * Whether log layer WARNING is enabled.
   *
   * @default false
   * @returns {boolean} Whether log layer WARNING is enabled.
   */
  static isWarningLayerEnabled(): boolean {
    return process.env.ENABLE_WARNING_LAYER === 'true';
  }

  /**
   * Returns origin URL depending on environment.
   *
   * @default DEVELOPMENT_URL
   * @returns {string} Origin URL.
   */
  static getOrigin(): string {
    if (process.env.ORIGIN_URL && process.env.ORIGIN_URL.length) {
      return process.env.ORIGIN_URL;
    }
    if (process.env.ENVIRONMENT === 'production') {
      return PRODUCTION_URL;
    }
    return DEVELOPMENT_URL;
  }

}