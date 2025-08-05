// Packages
import express, { Application, Express } from 'express';

// Local Imports
import { RateLimiter } from './helpers/rate-limit';
import { Environment } from './helpers/environment';
import { SaveRoutes } from './handlers/saves';
import { Monitor } from './helpers/monitor';

/**
 * Wrapper around all the server layers.
 */
export class Server {
  /**
   * Static reference to the express app.
   */
  protected static _app: Express;

  /**
   * Server constructor initializes layers.
   */
  constructor() {
    this.stop();
  }

  /**
   * Starts the server.
   * 
   * @returns {Promise<void>} Promise of the action.
   */
  async start(): Promise<void> {
    const saves = new SaveRoutes();

    saves.add(Server._app as Application);

    setInterval(
      RateLimiter.cleanUp,
      1000 * 60 * 10,
    );

    Server._app.listen(
      Environment.getServerPort(),
      () => {
        Monitor.log(
          Server,
          `Server is running on port ${Environment.getServerPort()}`,
          Monitor.Layer.SUCCESS,
        );
      },
    );
  }

  /**
   * Stops the server.
   * 
   * @returns {void} Promise of the action.
   */
  stop(): void {
    Server._app = express();
    Server._app.use(express.json());
  }
}