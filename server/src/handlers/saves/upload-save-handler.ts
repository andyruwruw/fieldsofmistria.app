// Local Imports
import {
  MESSAGE_HANDLER_PARAMETER_MISSING,
  MESSAGE_INTERNAL_SERVER_ERROR,
} from '../../config/messages';
import {
  REQUEST_TYPE,
  UPLOAD_TYPE,
} from '../../config';
import { FieldsOfMistriaSaveData } from '../../types/fields-of-mistria';
import { Monitor } from '../../helpers/monitor';
import { Handler } from '../handler';
import { unpack } from '../../helpers/save-files';
import FieldsOfMistriaSaveParser from '../../helpers/save-parser';

// Types
import {
  ServerRequest,
  ServerResponse,
} from '../../types';

/**
 * Uploads a user's save file to be unpacked.
 */
export class UnpackSaveHandler extends Handler {
  /**
   * Instantiates a new handler.
   */
  constructor() {
    super(
      REQUEST_TYPE.POST,
      '/',
      UPLOAD_TYPE.SAVE,
    );
  }

  /**
   * Handles the request.
   *
   * @param {ServerRequest} req Incoming request.
   * @param {ServerResponse} res Outgoing response.
   */
  async execute(
    req: ServerRequest,
    res: ServerResponse,
  ): Promise<void> {
    try {
      // Check for all required parameters.
      if (!req.file) {
        res.status(400).send({
          error: MESSAGE_HANDLER_PARAMETER_MISSING(
            'save',
            'File',
          ),
        });
        return;
      }

      const result = await unpack(req.file.originalname);

      const parser = new FieldsOfMistriaSaveParser(result as FieldsOfMistriaSaveData);
      const parsedData = parser.parse();

      res.status(200).send({
        ...result,
        parsedData,
      });
    } catch (error) {
      Monitor.log(
        UnpackSaveHandler,
        `${error}`,
        Monitor.Layer.WARNING,
      );

      res.status(500).send({
        error: MESSAGE_INTERNAL_SERVER_ERROR,
      });
    }
  }
}