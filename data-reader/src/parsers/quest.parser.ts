// Packages
import { Cheerio, CheerioAPI } from 'cheerio';

// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { QuestListParser } from './quest-list.parser';
import { Parser } from './parser';

// Types
import { Quest, QuestRewardItem, QuestRewards } from '../models/quests';

/**
 * Converts a display name into the repo's slug-id convention.
 *
 * @param {string} name - The display name to slugify.
 * @returns {string} The slugified id.
 */
const toId = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Builds a `Quest` object for a single quest, using cells resolved and
 * cached by `QuestListParser` (quests don't have individual wiki pages;
 * they're rows in tables on the single Quests page, so this parser reads
 * back the row rather than fetching anything new).
 */
export class QuestPageParser extends Parser<Quest> {
  /**
   * The id of the quest to parse, as assigned by `QuestListParser`.
   */
  private _id: string;

  /**
   * Constructs a new QuestPageParser instance.
   *
   * @param {string} url The URL of the Quests page.
   * @param {CheerioAPI} page The Cheerio instance representing the Quests page.
   * @param {string} id The id of the quest to parse.
   */
  constructor(
    url: string,
    page: CheerioAPI,
    id: string,
  ) {
    super(url, page);

    this._id = id;
  }

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Quest>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Quest> {
    const row = QuestListParser.getRow(this._id);

    if (!row) {
      return this._empty();
    }

    const { cells, type, section, name, anchor } = row;

    const giverCell = cells['Requester'] || cells['Character'] || cells['Source'] || null;
    const requirementsToReceiveCell = cells['Requirements to Receive'] || cells['Other Requirements to Receive'] || null;
    const requirementsToCompleteCell = cells['Requirements to Complete'] || cells['Requirements'] || null;

    return {
      id: row.id,
      name,
      type,
      section,
      description: this._textOf(cells['Description'] || null),
      giver: this._giverFromCell(giverCell),
      source: this._textOf(cells['Source'] || null),
      requirementsToReceive: this._textOf(requirementsToReceiveCell),
      requirementsToComplete: this._textOf(requirementsToCompleteCell),
      rewards: this._extractRewards(cells['Rewards'] || null),
      friendshipLevel: this._friendshipLevel(cells['Friendship Level Required'] || null),
      location: this._textOf(cells['Location'] || null),
      requiredDish: this._textOf(cells['Required Dish'] || null),
      requiredMonsters: this._textOf(cells['Required Monsters'] || null),
      monsterLocation: this._textOf(cells['Monster Location'] || null),
      order: this._orderOf(cells['#'] || null),
      href: `${this._url}#${anchor}`,
    };
  }

  /**
   * Returns an empty Quest for an id that couldn't be found in the cache.
   *
   * @returns {Quest} An empty quest.
   */
  private _empty(): Quest {
    return {
      id: this._id,
      name: '',
      type: 'story',
      section: '',
      description: '',
      giver: '',
      source: '',
      requirementsToReceive: '',
      requirementsToComplete: '',
      rewards: { items: [], tesserae: 0, renown: 0 },
      friendshipLevel: 0,
      location: '',
      requiredDish: '',
      requiredMonsters: '',
      monsterLocation: '',
      order: 0,
      href: this._url,
    };
  }

  /**
   * Extracts the readable text of a cell, dropping hidden sort-key spans
   * (`style="display:none"`) and turning `<br>`/block elements into
   * newlines.
   *
   * @param {Cheerio<any> | null} cell The cell to extract text from.
   * @returns {string} The cell's readable text.
   */
  private _textOf(cell: Cheerio<any> | null): string {
    if (!cell || cell.length === 0) {
      return '';
    }

    const raw = this._nodeText(cell.get(0));

    return raw
      .split('\n')
      .map((line: string) => line.replace(/\s+/g, ' ').trim())
      .filter((line: string) => line.length > 0)
      .join('\n')
      .trim();
  }

  /**
   * Recursively extracts text from a node, skipping hidden nodes and
   * inserting newlines for `<br>`/block-level elements.
   *
   * @param {any} node The node to extract text from.
   * @returns {string} The node's text.
   */
  private _nodeText(node: any): string {
    if (!node) {
      return '';
    }

    if (node.type === 'text') {
      return node.data || '';
    }

    if (node.type !== 'tag') {
      return '';
    }

    if (node.name === 'style' || node.name === 'script') {
      return '';
    }

    const style = (node.attribs?.style || '').replace(/\s+/g, '');
    if (style.includes('display:none')) {
      return '';
    }

    if (node.name === 'br') {
      return '\n';
    }

    const childText = (node.children || []).map((child: any) => this._nodeText(child)).join('');

    if (node.name === 'p' || node.name === 'li' || node.name === 'div') {
      return `${childText}\n`;
    }

    return childText;
  }

  /**
   * Extracts the giver's name from a cell, using the wiki's `span.sprite-text`
   * icon+name convention shared by "Requester"/"Character" columns and
   * inline mentions in "Source" columns (e.g. "Letter from Adeline").
   *
   * @param {Cheerio<any> | null} cell The cell to extract the giver from.
   * @returns {string} The giver's name, or an empty string if the quest isn't tied to an NPC.
   */
  private _giverFromCell(cell: Cheerio<any> | null): string {
    if (!cell || cell.length === 0) {
      return '';
    }

    const spriteText = cell.find('span.sprite-text').first();

    return spriteText.length > 0 ? spriteText.text().trim() : '';
  }

  /**
   * Extracts structured rewards (items, tesserae, renown) from a Rewards
   * cell.
   *
   * @param {Cheerio<any> | null} cell The Rewards cell.
   * @returns {QuestRewards} The extracted rewards.
   */
  private _extractRewards(cell: Cheerio<any> | null): QuestRewards {
    const rewards: QuestRewards = {
      items: [],
      tesserae: 0,
      renown: 0,
    };

    if (!cell || cell.length === 0) {
      return rewards;
    }

    const text = this._textOf(cell);

    const tesseraeMatch = text.match(/([\d,]+)t\b/);
    if (tesseraeMatch) {
      rewards.tesserae = convertTesseraeString(tesseraeMatch[0]);
    }

    const renownMatch = text.match(/(\d+)\s*Renown/);
    if (renownMatch) {
      rewards.renown = parseInt(renownMatch[1], 10);
    }

    const itemMap = new Map<string, QuestRewardItem>();

    cell.find('a[href^="/wiki/"]').each((_index: number, a: any): void => {
      const $a = this._page(a);
      const href = $a.attr('href') || '';
      const title = $a.attr('title') || $a.text().trim();

      if (!title || /Renown|Tesserae_Icon|Request_Board|^\/wiki\/Quests$/.test(href)) {
        return;
      }

      const fullHref = `${BASE_URL}${href}`;
      const item = itemMap.get(fullHref) || {
        id: toId(title),
        name: title,
        href: fullHref,
        quantity: 1,
      };

      const nextNode = a.next;
      const siblingText = nextNode && nextNode.type === 'text' ? nextNode.data : '';
      const qtyMatch = siblingText.match(/\((\d+)\)/);

      if (qtyMatch) {
        item.quantity = parseInt(qtyMatch[1], 10);
      }

      itemMap.set(fullHref, item);
    });

    rewards.items = Array.from(itemMap.values());

    return rewards;
  }

  /**
   * Extracts the number of friendship hearts required from a
   * "Friendship Level Required" cell (e.g. "(2 Hearts)").
   *
   * @param {Cheerio<any> | null} cell The cell to extract the friendship level from.
   * @returns {number} The number of hearts required, or 0 if not present.
   */
  private _friendshipLevel(cell: Cheerio<any> | null): number {
    const text = this._textOf(cell);
    const match = text.match(/(\d+)\s*Heart/);

    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Extracts a numeric order/index from a "#" cell.
   *
   * @param {Cheerio<any> | null} cell The cell to extract the order from.
   * @returns {number} The order, or 0 if not present.
   */
  private _orderOf(cell: Cheerio<any> | null): number {
    const text = this._textOf(cell);
    const match = text.match(/(\d+)/);

    return match ? parseInt(match[1], 10) : 0;
  }
}
