// Local Imports
import { postForm } from '../http/client';

// Types
import type { FieldsOfMistriaSaveData } from '../types/fields-of-mistria';

/**
 * Uploads a Fields of Mistria save file to the unpack server.
 *
 * @param {File} save - The `.sav` file to unpack.
 * @returns {Promise<FieldsOfMistriaSaveData>} The unpacked save data.
 */
const uploadSave = async (save: File): Promise<FieldsOfMistriaSaveData> => {
  const form = new FormData();
  form.append(
    'file',
    save,
  );

  return postForm<FieldsOfMistriaSaveData>(
    '/saves',
    form,
  );
};

export default {
  uploadSave,
};
