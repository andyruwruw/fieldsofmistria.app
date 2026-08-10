// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { Event, EventStall } from '../models/events';

/**
 * Converts a display name into the repo's slug-id convention.
 *
 * @param {string} name - The display name to slugify.
 * @returns {string} The slugified id.
 */
const toId = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Parses a festival page to extract festival information from its
 * `div.druid-infobox`, whose rows carry stable `druid-data-<field>` classes.
 */
export class FestivalPageParser extends Parser<Event> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Event>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Event> {
    const name = this._getTitle();

    return {
      id: toId(name),
      name,
      href: this._url,
      location: this._getRowLinkText('location'),
      day: this._getDay(),
      season: this._getSeason(),
      frequency: this._getText('.druid-data-frequency').toLowerCase(),
      quests: this._getQuestNames().map(toId),
      theme: this._getRowLinkText('theme'),
      'theme-audio': this._getThemeAudio(),
      activities: this._getActivityNames().map(toId),
      stalls: this._getStalls(),
    };
  }

  /**
   * Extracts the event's name from the infobox title, stripping the icon.
   *
   * @returns {string} The event name.
   */
  private _getTitle(): string {
    return this._getText('.druid-title');
  }

  /**
   * Gets the text of the first link inside a `druid-data-<field>` row.
   *
   * @param {string} field - The row's field name (e.g. `location`, `theme`).
   * @returns {string} The link text, or empty string if not found.
   */
  private _getRowLinkText(field: string): string {
    return this._getFirst(`.druid-data-${field} a`).text().trim();
  }

  /**
   * Extracts the day-of-season number from the date row.
   *
   * @returns {number} The day number.
   */
  private _getDay(): number {
    const text = this._getText('.druid-data-date');
    const match = text.match(/(\d+)/);

    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Extracts the season name from the date row's link.
   *
   * @returns {string} The lowercase season name.
   */
  private _getSeason(): string {
    return this._getRowLinkText('date').toLowerCase();
  }

  /**
   * Extracts the display names of quests tied to the event, skipping
   * icon-only links.
   *
   * @returns {string[]} Quest display names, quotes stripped.
   */
  private _getQuestNames(): string[] {
    const names: string[] = [];

    this._get('.druid-data-quest a').each((_index: number, el: any): void => {
      const text = this._page(el).text().trim().replace(/^"|"$/g, '');

      if (text) {
        names.push(text);
      }
    });

    return names;
  }

  /**
   * Extracts the theme's audio file URL, if present.
   *
   * @returns {string} The absolute audio URL, or empty string.
   */
  private _getThemeAudio(): string {
    const src = this._getFirst('.druid-data-theme audio source').attr('src');

    return src ? `${BASE_URL}${src}` : '';
  }

  /**
   * Extracts activity display names, skipping in-page anchor links
   * (e.g. `#Prizes`) that aren't real wiki pages.
   *
   * @returns {string[]} Activity display names.
   */
  private _getActivityNames(): string[] {
    const names: string[] = [];

    this._get('.druid-data-activity a').each((_index: number, el: any): void => {
      const href = this._page(el).attr('href') || '';
      const text = this._page(el).text().trim();

      if (text && href.startsWith('/wiki/')) {
        names.push(text);
      }
    });

    return names;
  }

  /**
   * Extracts each stall's name and the villager ids running it. The stall
   * data alternates `<a href="#Stall_Name">` / `<li>(run by ...)</li>`
   * siblings inside `.druid-data-stall`.
   *
   * @returns {EventStall[]} The event's stalls.
   */
  private _getStalls(): EventStall[] {
    const stalls: EventStall[] = [];
    const children = this._getFirst('.druid-data-stall').children();

    let current: EventStall | null = null;

    children.each((_index: number, el: any): void => {
      const node = this._page(el);

      if (el.name === 'a') {
        current = {
          name: node.text().trim(),
          vendors: [],
        };
        stalls.push(current);
      } else if (el.name === 'li' && current) {
        node.find('a[href^="/wiki/"]').each((_i: number, vendor: any): void => {
          const vendorName = this._page(vendor).text().trim();

          if (vendorName) {
            (current as EventStall).vendors.push(toId(vendorName));
          }
        });
      }
    });

    return stalls;
  }
}
