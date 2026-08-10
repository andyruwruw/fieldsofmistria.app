// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { MonsterPageParser } from '../parsers/monster.parser';
import { MonsterListParser } from '../parsers/monster-list.parser';
import { MONSTERS_URL } from '../config';
import { fetchAll, fetchPage } from '../utils/scraper';

// Types
import { Monster } from '../models/monsters';
import { CheerioAPI } from 'cheerio';

/**
 * Service for managing monster data.
 */
export class MonstersService {
  /**
   * Fetches monster data for all monsters.
   *
   * @returns {Promise<Monster[]>} A promise that resolves to an array of Monster objects.
   */
  async fetch(): Promise<Monster[]> {
    const monsterList = await this._getMonsterList();

    // Multiple monster variants can share the same detail page (e.g. every
    // Rock Clod color links to `/wiki/Clod`), so fetch each unique href only
    // once and reuse the parsed page for every variant that needs it.
    const uniqueHrefs = Array.from(new Set(monsterList.map((item: Record<string, string>): string => (item.href))));

    let last = 0;
    const pages = await fetchAll(uniqueHrefs, async (url: string, i: number): Promise<[string, CheerioAPI]> => {
      const percent = Math.floor((i / uniqueHrefs.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Monsters`);
      }

      return [url, await fetchPage(url)];
    });

    const pagesByHref = new Map<string, CheerioAPI>(pages);

    const result = await Promise.all(monsterList.map(async (item: Record<string, string>): Promise<Monster | undefined> => {
      const row = MonsterListParser.getRow(item.id);
      const page = pagesByHref.get(item.href);

      if (!row || !page) {
        return undefined;
      }

      const parser = new MonsterPageParser(
        item.href,
        page,
        row,
      );

      return parser.parse();
    }));

    console.log(`100% | Done Fetching Monsters`);

    return result.filter((monster: Monster | undefined): monster is Monster => (!!monster));
  }

  /**
   * Fetches a list of monster URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of monster list rows.
   */
  async _getMonsterList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(MONSTERS_URL);

    const parser = new MonsterListParser(
      MONSTERS_URL,
      page,
    );

    return parser.parse();
  }
}
