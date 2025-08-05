/* eslint-disable @typescript-eslint/no-explicit-any */
// Local Imports
import { Environment } from './environment';

// Types
import { Dictionary } from '../types';

/**
 * This class replaces console.log for a more standardized
 * way of logging.
 */
export class Monitor {
  /**
   * StOut escape code for resetting formatting.
   *
   * @constant
   */
  static STD_OUT_ESCAPE_CODE_RESET = '\x1b[0m';

  /**
   * Format for different monitor layers.
   *
   * @constant
   */
  static STD_OUT_MONITOR_LAYER_NAME_FORMATING = {
    0: '\x1b[90m', // DEBUG Grey
    1: '\x1b[91m', // WARNING Red
    2: '\x1b[33m', // UPDATE Yellow
    3: '\x1b[32m', // SUCCESS Green
    4: '\x1b[32m', // PROGRESS Blue
  } as Dictionary<string>;

  /**
   * Format for different monitor layers.
   *
   * @constant
   */
  static STD_OUT_MONITOR_LAYER_MESSAGE_FORMATING = {
    0: '\x1b[90m', // DEBUG
    1: '\x1b[37m', // WARNING
    2: '\x1b[37m', // UPDATE
    3: '\x1b[37m', // UPDATE
    4: '\x1b[37m', // UPDATE
  } as Dictionary<string>;

  /**
   * Layers of monitor output.
   *
   * @constant
   */
  static Layer = {
    DEBUG: 0,
    WARNING: 1,
    UPDATE: 2,
    SUCCESS: 3,
    PROGRESS: 4,
  } as Dictionary<number>;

  /**
   * Print a statement to the console.
   *
   * @param {string} text Text to be printed.
   * @param {number} layer Layer to print text to.
   */
  static log(source: any, text: string, layer = 0) {
    if (Monitor._shouldLog(layer)) {
      console.log(
        `${Monitor.STD_OUT_MONITOR_LAYER_NAME_FORMATING[`${layer}`]}[${
          source.name
        }]:${Monitor.STD_OUT_ESCAPE_CODE_RESET}`,
        `${Monitor.STD_OUT_MONITOR_LAYER_MESSAGE_FORMATING[`${layer}`]}${text}${
          Monitor.STD_OUT_ESCAPE_CODE_RESET
        }`,
      );
    }
  }

  /**
   * Print a trace statement to the console.
   *
   * @param {string} text Text to be printed.
   * @param {number} layer Layer to print text to.
   */
  static trace(source: any, text: string, layer = 0) {
    if (Monitor._shouldLog(layer)) {
      console.trace(
        `${Monitor.STD_OUT_MONITOR_LAYER_NAME_FORMATING[`${layer}`]}[${
          source.name
        }]:${Monitor.STD_OUT_ESCAPE_CODE_RESET}`,
        `${Monitor.STD_OUT_MONITOR_LAYER_MESSAGE_FORMATING[`${layer}`]}${text}${
          Monitor.STD_OUT_ESCAPE_CODE_RESET
        }`,
      );
    }
  }

  /**
   * Displays memory update.
   */
  static logMemory() {
    const mbUsed =
      Math.round(process.memoryUsage().heapUsed / 1024 / 10.24) / 100;

    Monitor.log(Monitor, `Memory in Use: ${mbUsed} MB`, Monitor.Layer.WARNING);
  }

  /**
   * Returns whether or not the layer is active.
   * @param {number} layer Monitor layer.
   * @returns {boolean} Whether the layer is active.
   */
  static _shouldLog(layer: number) {
    return true;

    if (layer === Monitor.Layer.DEBUG) {
      return Environment.isDebugLayerEnabled();
    }
    if (layer === Monitor.Layer.WARNING) {
      return Environment.isWarningLayerEnabled();
    }
    return Environment.isUpdateLayerEnabled();
  }
}
