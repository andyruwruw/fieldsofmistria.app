// Local Imports
import { UnpackSaveHandler } from './upload-save-handler';
import { Router } from '../router';

/**
 * Save routes.
 */
export class SaveRoutes extends Router {
  /**
   * Instantiates an router wrapper.
   */
  constructor() {
    super('/saves');
  }

  /**
   * Initializes all routes.
   * 
   * @returns {void}
   */
  _initialize(): void {
    this._routes.push(new UnpackSaveHandler());
  }
}
