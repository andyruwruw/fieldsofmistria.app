// Packages
import {
  NextFunction,
  Request,
  Response,
} from 'express';

/**
 * Basic object type.
 */
export type Dictionary<T> = Record<string, T>;

/**
 * API request object.
 */
export interface ServerRequest extends Request {
  file?: Express.Multer.File;

  filename?: string;
}

/**
 * API response object.
 */
export type ServerResponse = Response;

/**
 * Middleware function for Express.
 */
export type Middleware = ((
  req?: ServerRequest,
  res?: ServerResponse,
  next?: NextFunction,
) => Promise<void> | void)
| ((
  req: ServerRequest,
  res: ServerResponse,
  next: NextFunction,
) => Promise<void> | void)
| NextFunction
| RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

/**
 * Various request types.
 */
export type RequestType = 'get'
| 'patch'
| 'post'
| 'delete';

/**
 * Handler upload type.
 */
export type UploadType = 'none'
| 'save';
