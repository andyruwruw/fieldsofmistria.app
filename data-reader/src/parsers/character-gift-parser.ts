// Local Imports
import { ItemService } from '../services/item-service';
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the character gift page to extract character URLs.
 */
export class CharacterGiftParser extends Parser<Record<string, string[]>> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string[]>>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string[]>> {
    const mainChildren = this._page('div.mw-content-ltr').children();

    const gifts: Record<string, string[]> = {
      loved: [],
      liked: [],
      disliked: [],
      hated: [],
    };

    let isDesiredTable = false;
    let table = '';
    const tables = {
      'Loved Gift': 'loved',
      'Loved Gifts': 'loved',
      'Liked Gift': 'liked',
      'Liked Gifts': 'liked',
      'Disliked Gift': 'disliked',
      'Disliked Gifts': 'disliked',
      'Hated Gift': 'hated',
      'Hated Gifts': 'hated',
    };

    for (let i = 0; i < mainChildren.length; i += 1) {
      const child = mainChildren[i];

      if (child.type === 'tag' && child.name === 'h2') {
        const texts = child.children;

        for (let j = 0; j < texts.length; j += 1) {
          const text = texts[j];

          if (text.type === 'tag'
            && text.name === 'span'
            && text.attribs?.class === 'mw-headline'
            && text.children[0].type === 'text'
            && Object.keys(tables).includes(text.children[0].data)) {
            isDesiredTable = true;

            if (text.children[0].data === 'Loved Gift' || text.children[0].data === 'Loved Gifts') {
              table = 'loved';
            } else if (text.children[0].data === 'Liked Gift' || text.children[0].data === 'Liked Gifts') {
              table = 'liked';
            } else if (text.children[0].data === 'Disliked Gift' || text.children[0].data === 'Disliked Gifts') {
              table = 'disliked';
            } else if (text.children[0].data === 'Hated Gift' || text.children[0].data === 'Hated Gifts') {
              table = 'hated';
            }
          }
        }
      } else if (child.type === 'tag' && child.name === 'table' && isDesiredTable) {
        isDesiredTable = false;
        const sections = child.children;

        for (let k = 0; k < sections.length; k += 1) {
          const section = sections[k];

          if (section.type === 'tag' && section.name === 'tbody') {
            const rows = section.children;

            for (let l = 0; l < rows.length; l += 1) {
              const row = rows[l];

              if (row.type === 'tag' && row.name === 'tr') {
                const cells = row.children.filter(cell => cell.type === 'tag' && cell.name === 'td');

                if (cells.length > 1 && cells[1].type === 'tag' && cells[1].name === 'td') {
                  // console.log(cells[1].children[0]);
                  const item = cells[1].children[0];

                  if (item.type === 'tag' && item.name === 'a') {
                    const itemTitle = item.attribs?.title?.trim().toLowerCase().replace(/\s+/g, '-') || '';
                    const itemUrl = `${BASE_URL}${item.attribs?.href?.trim()}` || '';

                    if (!gifts[table]) {
                      gifts[table] = [];
                    }

                    if (itemTitle) {
                      gifts[table].push(itemTitle);

                      ItemService.queueItem(
                        itemTitle,
                        itemUrl,
                      );
                    }
                  }
                }
              }
            }
          }
        }


      }
    }

    return gifts;
  }
}