// Local Imports
import { Parser } from './parser';

// Types
import { Skill } from '../models/skills';
import { BASE_URL } from '../config';

/**
 * Parses the main skills page to extract skills.
 */
export class SkillsParser extends Parser<Skill[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Skill[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Skill[]> {
    const mainChildren = this._get('div.mw-body-content table tr');

    const skills = [] as Skill[];

    let tier = 1;
    let level = 1;
    let sinceLast = 0;

    let category = '';

    for (let i = 0; i < mainChildren.length; i += 1) {
      const child = mainChildren[i];

      const row = this._parseRow(child);
      let isHeader = false;
      let skipMe = false;

      const skill: Skill = {
        id: '',
        'icon-image': '',
        name: '',
        description: '',
        cost: 0,
        category,
        tier,
        level,
        index: sinceLast,
        href: '',
      };
      sinceLast += 1;

      for (let j = 0; j < row.length; j += 1) {
        if (isHeader || skipMe) {
          continue;
        }

        const cell = this._condenseInterestingData(row[j]);

        if (cell && cell.text && cell.text.includes('Tier')) {
          const TIER_MATCH = /Tier\s+(\d+)\s+\(Lvl (\d+)\)/;

          const match = cell.text.match(TIER_MATCH);

          if (match) {
            tier = parseInt(match[1], 10);
            level = parseInt(match[2], 10);
            sinceLast = 0;

            if (tier === 1) {
              if (category === '') {
                category = 'farming';
                skill.category = category;
              } else if (category === 'farming') {
                category = 'fishing';
              } else if (category === 'fishing') {
                category = 'archaeology';
              } else if (category === 'archaeology') {
                category = 'cooking';
              } else if (category === 'cooking') {
                category = 'ranching';
              } else if (category === 'ranching') {
                category = 'woodcrafting';
              } else if (category === 'woodcrafting') {
                category = 'blacksmithing';
              } else if (category === 'blacksmithing') {
                category = 'mining';
              } else if (category === 'mining') {
                category = 'combat';
              }
            }
          }

          isHeader = true;
        }

        if (j === 0) {
          if (!('src' in cell)) {
            skipMe = true;
            break;
          }

          skill['icon-image'] = `${BASE_URL}${cell.src}`;
        } else if (j === 1) {
          skill.id = cell.text.toLowerCase().replace(/\s/g, '-')
          skill.name = cell.text;
        } else if (j === 2) {
          skill.description = cell.text;
        } else if (j === 3) {
          skill.cost = parseInt(cell.text, 10);
        }
      }

      if (!skill.id.length) {
        continue;
      }

      skills.push(skill);
    }

    return skills;
  }
}
