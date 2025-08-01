// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { SKILLS_URL } from '../config';
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
    return [];
  }
}