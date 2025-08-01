// Types
import { Item } from '../models/items';

/**
 * ItemService class to manage items and their links.
 * This class provides methods to queue items and keep track of their links.
 * It is designed to be used in a data reader context.
 */
export class ItemsService {
  /**
   * Static property to keep track of what items have been processed.
   */
  static _items: Record<string, boolean> = {};

  /**
   * Static property to keep track of item links.
   */
  static _links: Record<string, string> = {};

  /**
   * Fetches character data for all characters.
   *
   * @returns {Promise<Character[]>} A promise that resolves to an array of Character objects.
   */
  async fetch(): Promise<Item[]> {
    return [];
  }

  /**
   * Static method to queue an item for processing.
   *
   * @param {string} id - The ID of the item.
   * @param {string} link - The link to the item.
   */
  static queueItem(
    id: string,
    link = '',
  ): void {
    const itemId = id.toLowerCase().replace(/\s+/g, '-').trim();

    if (!this._items[itemId]) {
      this._items[itemId] = true;
      this._links[itemId] = link;
    }
  }
}