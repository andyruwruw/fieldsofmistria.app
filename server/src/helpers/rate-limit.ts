// Types
import { MESSAGE_INTERNAL_SERVER_ERROR } from '../config/messages';
import { Monitor } from './monitor';

// Types
import {
  Dictionary,
  Middleware,
  ServerRequest,
  ServerResponse,
} from '../types';

/**
 * Get rate limited son.
 */
export class RateLimiter {
  /**
   * IPs logged.
   */
  static ips = {} as Dictionary<number[]>;

  /**
   * Users logged.
   */
  static users = {} as Dictionary<number[]>;

  /**
   * Lets not run out of memory.
   */
  static cleanUp() {
    const minuteAgo = Date.now() - 60000;

    let removeIps = [];

    for (let ip in RateLimiter.ips) {
      RateLimiter.ips[ip] = RateLimiter.ips[ip].filter((time: number) => {
        return time > minuteAgo;
      });

      if (!RateLimiter.ips[ip]) {
        removeIps.push(ip);
      }
    }

    for (let ip of removeIps) {
      delete RateLimiter.ips[ip];
    }
  }

  /**
   * Validates a request.
   *
   * @param {ServerRequest} req Incoming request.
   */
  static async rateLimit(
    req?: ServerRequest,
    res?: ServerResponse,
    next?: Middleware,
  ): Promise<void> {
    if (!req) {
      return;
    }

    if (!res) {
      return;
    }

    if (!next) {
      return;
    }

    try {
      // If this is a subsequent request.
      if ('ip' in req && req.ip && req.ip in RateLimiter.ips) {
        // Remove old entries.
        const minuteAgo = Date.now() - 60000;
        RateLimiter.ips[req.ip] = RateLimiter.ips[req.ip].filter((time: number) => {
          return time > minuteAgo;
        });
      } else if ('ip' in req && req.ip) {
        RateLimiter.ips[req.ip] = [];
      }

      if ('ip' in req && req.ip) {
        RateLimiter.ips[req.ip].push(Date.now());

        if (RateLimiter.ips[req.ip].length > 9) {
          res.status(429).send();
          return;
        }
      }

      next();
    } catch (error) {
      Monitor.log(
        RateLimiter,
        `${error}`,
        Monitor.Layer.WARNING,
      );

      res.status(500).send({
        error: MESSAGE_INTERNAL_SERVER_ERROR,
      });
    }
  }
}