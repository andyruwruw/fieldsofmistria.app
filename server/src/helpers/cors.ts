// Packages
import { NextFunction } from 'express';

// Local Imports
import { Environment } from './environment';

// Types
import {
  ServerRequest,
  ServerResponse,
} from '../types';

/**
 * Does CORS stuff.
 *
 * @param {ServerRequest} req Incoming request.
 * @param {ServerResponse} res Outgoing response.
 */
export const handleCors = (
  req: ServerRequest,
  res: ServerResponse,
  next: NextFunction,
): void => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    Environment.getOrigin(),
  );
  res.setHeader(
    'Access-Control-Allow-Credentials',
    'true',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,Accept, X-Requested-With, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
  );

  console.log(Environment.getOrigin());

  next();
};
