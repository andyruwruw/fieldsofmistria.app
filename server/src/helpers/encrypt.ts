// Packages
import crypto from 'node:crypto';

/**
 * Encrypt a value.
 *
 * @param {string} value Value of item.
 * @returns {string} Encrypted string.
 */
export const encrypt = (name: string): string => {
  const hash = crypto.createHash('sha256');
  return hash.update(name).digest('hex');
};
