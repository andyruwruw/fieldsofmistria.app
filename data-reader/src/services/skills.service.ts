// Local Imports
import { SkillsParser } from '../parsers/skills.parser';
import { SKILLS_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import { Skill } from '../models/skills';

/**
 * Service for managing skill data.
 */
export class SkillsService {
  /**
   * Fetches skill data for all skills.
   *
   * @returns {Promise<Skill[]>} A promise that resolves to an array of Skill objects.
   */
  async fetch(): Promise<Skill[]> {
    return this._getSkillsPage();
  }

  /**
   * Fetches data for all skills.
   *
   * @returns {Promise<Skill[]>} A promise that resolves to an array of Bug objects.
   */
  async _getSkillsPage(): Promise<Skill[]> {
    const page = await fetchPage(SKILLS_URL);

    const parser = new SkillsParser(
      SKILLS_URL,
      page,
    );

    return parser.parse();
  }
}