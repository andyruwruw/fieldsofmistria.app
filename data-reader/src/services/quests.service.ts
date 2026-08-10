// Local Imports
import { QUESTS_URL } from '../config';
import { QuestListParser } from '../parsers/quest-list.parser';
import { QuestPageParser } from '../parsers/quest.parser';
import { fetchPage } from '../utils/scraper';

// Types
import { Quest } from '../models/quests';

/**
 * Service for managing quest data.
 *
 * Unlike most categories on the wiki, quests don't have individual pages;
 * every quest is a row in a table on the single Quests page (organized into
 * sections like "Story Quests" and "Requests"). So this service fetches
 * that one page, then parses every quest directly off of it instead of
 * fetching a page per quest.
 */
export class QuestsService {
  /**
   * Fetches quest data for all quests.
   *
   * @returns {Promise<Quest[]>} A promise that resolves to an array of Quest objects.
   */
  async fetch(): Promise<Quest[]> {
    const page = await fetchPage(QUESTS_URL);

    const listParser = new QuestListParser(
      QUESTS_URL,
      page,
    );

    const rows = await listParser.parse();

    return Promise.all(rows.map((row: Record<string, string>): Promise<Quest> => (
      new QuestPageParser(
        QUESTS_URL,
        page,
        row.id,
      ).parse()
    )));
  }
}
