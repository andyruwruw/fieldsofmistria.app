// Types
import { UPLOAD_TYPE } from '../config';
import {
  RequestType,
  ServerRequest,
  ServerResponse,
  UploadType,
} from '../types';

/**
 * Abstract handler class.
 */
export class Handler {
  /**
   * Handler request type.
   */
  protected _method: RequestType;

  /**
   * Handler path.
   */
  protected _path: string;

  /**
   * Whether this handler requires a file upload.
   */
  protected _upload: UploadType;

  /**
   * Instantiates a new handler.
   *
   * @param {RequestType} method Request type.
   * @param {string} path Request path.
   * @param {UploadType} [upload = 'none'] Whether the handler needs to upload files.
   */
  constructor(
    method: RequestType,
    path: string,
    upload: UploadType = UPLOAD_TYPE.NONE,
  ) {

    this._method = method;
    this._path = path;
    this._upload = upload;
  }

  /**
   * Handles the request.
   *
   * @param {ServerRequest} req Incoming request.
   * @param {ServerResponse} res Outgoing response.
   */
  async execute(req: ServerRequest, res: ServerResponse): Promise<void> {}

  /**
   * Connects to the database.
   */
  async _connectDatabase(): Promise<void> {
  }

  /**
   * Retrieves this handler's request method.
   *
   * @returns {RequestType} Handler's request method..
   */
  getMethod(): RequestType {
    return this._method;
  }

  /**
   * Retrieves this handler's path.
   *
   * @returns {string} Handler's path.
   */
  getPath(): string {
    return this._path;
  }

  /**
   * Whether this endpoint requires file upload.
   */
  getUpload(): UploadType {
    return this._upload;
  }
}
