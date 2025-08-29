// Local Imports
import { Parser } from './parser';

// Types
import { Event } from '../models/events';

/**
 * Parses a festival page to extract festival information.
 */
export class FestivalPageParser extends Parser<Event> {
  protected _data: Record<string, any> = {};

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Event>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Event> {
    try {
      this._data = await this._parseDruidAside();

      const event: Record<string, any> = {};

      for (const key in this._data) {
        const wrapper = this._data[key];

        const values = this._flattenValues(wrapper);

        if (values.has('Event Location')) {
          const HAS_CAPITAL_LETTERS = /[A-Z]/

          for (const item of values.values()) {
            if (item === 'Event Location') {
              continue;
            }

            if (HAS_CAPITAL_LETTERS.test(item as string)) {
              event.location = item;
            }
          }
        } else if (values.has('Basic Information')) {
          const content = wrapper.content;

          for (const item of content) {
            const keys = this._flattenValues(item);

            if (keys.has('Date')) {
              event.date = parseInt(item.content[1].content[1].content.text[0]) || 0;
              event.season = item.content[1].content[1].content.text[1].toLowerCase() || '';
            } else if (keys.has('Frequency')) {
              event.frequency = item.content[1].content[0].content.text.toLowerCase() || '';
            } else if (keys.has('Theme')) {
              event.theme = item.content[1].content[3].content.src || '';
            }
          }
        } else if (values.has('Details')) {
          const content = wrapper.content;

          for (const item of content) {
            const keys = this._flattenValues(item);

            if (keys.has('Event Activities')) {
              event.activities = item.content[1].content.filter((element: any) => (element.tag === 'a' && 'text' in element.content)).map((element: any) => element.content.text.toLowerCase().replace(/\s+/g, '-'));
            } else if (keys.has('Stall(s)')) {
              const stalls = item.content[1].content
                .filter((item: any): boolean => {
                  return !('tag' in item && ((item.tag === 'text' && !item.content.text.length) || item.tag === 'br'));
                })
                .map((item: any) => {
                  if ('tag' in item && item.tag === 'text') {
                    return item.content.text || '';
                  } else if ('tag' in item && item.tag === 'a') {
                    return {
                      title: item.content.title || '',
                      text: item.content.text || '',
                      name: item.content.href || '',
                    }
                  }
              });

              console.log({stalls: stalls.map((item: any) => (typeof item === 'string' ? item : ('text' in item && item.text.length ? item.text : ('title' in item && item.title.length ? item.title : ''))))});
            }
          }
        }
      }

      console.log({event});

      return event as Event;
    } catch (error) {
      // console.log(this._data);
      console.log(error);
    }

    return {
    } as Event;
  }
}
