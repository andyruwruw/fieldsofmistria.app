// Packages
import {
  CheerioAPI,
  Cheerio,
} from 'cheerio';
import type {
  ChildNode,
  Element,
} from 'domhandler';

// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';

// Types
import {
  ParsedElement,
  ParsedElementType,
} from '../types';

/**
 * Parser class for extracting structured data from HTML pages.
 */
export abstract class Parser<T> {
  /**
   * The Cheerio instance representing the HTML page to parse.
   */
  protected _page: CheerioAPI;

  /**
   * The URL of the page being parsed.
   */
  protected _url: string;

  /**
   * Constructs a new Parser instance.
   *
   * @param {string} url The URL of the page being parsed.
   * @param {CheerioAPI} page The Cheerio instance representing the HTML page to parse.
   */
  constructor(
    url: string,
    page: CheerioAPI,
  ) {
    this._url = url;
    this._page = page;
  }

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<T>} A promise that resolves to the parsed data.
   */
  public abstract parse(): Promise<T>;

  /**
   * Gets all of a selected element from the page.
   *
   * @param {string} selector The CSS selector to match elements.
   * @returns {Cheerio<any>} A Cheerio instance containing the matched elements.
   */
  protected _get(selector: string): Cheerio<any> {
    return this._page(selector);
  }

  /**
    * Gets the first element that matches the selector.
    *
    * @param {string} selector The CSS selector to match the element.
    * @returns {Cheerio<any>} A Cheerio instance containing the first matched element.
    */
  protected _getFirst(selector: string): Cheerio<any> {
    return this._page(selector).first();
  }

  /**
    * Gets the last element that matches the selector.
    *
    * @param {string} selector The CSS selector to match the element.
    * @returns {Cheerio<any>} A Cheerio instance containing the last matched element.
    */
  protected _getLast(selector: string): Cheerio<any> {
    return this._page(selector).last();
  }

  /**
   * Gets all of the children of a selected element.
   *
   * @param {string} selector The CSS selector to match the parent element.
   * @returns {Cheerio<any>} A Cheerio instance containing the children of the matched element.
   */
  protected _getChildren(selector: string): Cheerio<any> {
    return this._page(selector).children();
  }

  /**
   * Gets the first child of a selected element.
   *
   * @param {string} selector The CSS selector to match the parent element.
   * @returns {Cheerio<any>} A Cheerio instance containing the first child of the matched element.
   */
  protected _getFirstChild(selector: string): Cheerio<any> {
    return this._page(selector).children().first();
  }

  /**
   * Gets all elements with a specific tag from a collection of items.
   * 
   * @param {Cheerio<any>} items The collection of items to search.
   * @param {string} tag The tag name to match.
   * @returns {Cheerio<any>[]} An array of matching elements.
   */
  protected _getAllWithTag(
    items: Cheerio<any>,
    tag: string
  ): Cheerio<any>[] {
    const filtered = [] as Cheerio<any>[];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];

      if (item.type === 'tag' && item.name === tag) {
        filtered.push(item);
      }
    }

    return filtered;
  }

  /**
   * Gets the text content of an element.
   *
   * @param {string} selector The CSS selector to match the element.
   * @returns {string} The text content of the matched element.
   */
  protected _getText(selector: string): string {
    return this._get(selector).text().trim();
  }

  /**
   * Parses a table from the HTML page.
   *
   * @param {Cheerio<any>} table The Cheerio instance representing the table to parse.
   * @returns {string[][]} An array of arrays representing the table's rows and columns.
   */
  protected _parseTable(table: Cheerio<any> | undefined): Record<string, any> | undefined {
    if (!table || table.length === 0) {
      return undefined; // No table found
    }

    const contents = typeof table.children === 'function' ? table.children() : table.children;
    let header = [] as ParsedElement[][]; // Header of the table
    let body = [] as ParsedElement[][]; // Body of the table

    for (let i = 0; i < contents.length; i += 1) {
      const content: Element = contents[i];

      if (content.type === 'tag') {
        if (content.name === 'thead') {
          header = this._parseTableHeader(content);
        } else if (content.name === 'tbody') {
          body = this._parseTableBody(content);
        }
      }
    }

    return {
      header,
      body,
    };
  }

  /**
   * Parses the header of a table.
   *
   * @param {Element} header The header element to parse.
   * @returns {ParsedElement[][]} An array of arrays representing the header's rows and columns.
   */
  protected _parseTableHeader(header: Element): ParsedElement[][] {
    const rows = header.children;
    const result = [];

    for (let i = 0; i < rows.length; i += 1) {
      // Should only be one.
      const row = rows[i];

      const contents = this._parseRow(row as any);

      if (contents.length === 0) {
        continue; // Skip empty rows
      }

      result.push(contents);
    }

    return result;
  }

  /**
   * Parses the body of a table.
   *
   * @param {Element} body The body element to parse.
   * @returns {ParsedElement[][]} An array of arrays representing the body's rows and columns.
   */
  protected _parseTableBody(body: Element): ParsedElement[][] {
    const rows = body.children;
    const result = [];

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];

      const contents = this._parseRow(row as any);

      if (contents.length === 0) {
        continue; // Skip empty rows
      }

      result.push(contents);
    }

    return result;
  }

  /**
   * Parses a row of a table.
   *
   * @param {Element} row The row element to parse.
   * @returns {string[]} An array of strings representing the row's columns.
   */
  protected _parseRow(row: Element): ParsedElement[] {
    const columns = typeof row.children === 'function' ? (row as any).children() : row.children;
    const result = [] as ParsedElement[];

    if (!columns || columns.length === 0) {
      return result;
    }

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];
      const parsed = this._parseElement(column);

      if (!parsed || parsed === null) {
        continue;
      } else if (parsed.value === '\n') {
        continue;
      } else if (parsed.type === 'text' && (parsed.value === '' || parsed.value.length === 0)) {
        continue; // Skip empty text nodes
      } else if (!!parsed) {
        result.push(parsed);
      }
    }

    return result;
  }

  /**
   * Parses a single element from the HTML page.
   *
   * @param {Element | ChildNode} element The element to parse.
   * @returns {ParsedElement} The parsed element.
   */
  protected _parseElement(element: Element | ChildNode): ParsedElement | null {
    let type = element.type as ParsedElementType;
    if (element.type === 'tag') {
      type = element.name as ParsedElementType;
    }

    let children = 'children' in element ? typeof element.children === 'function' ? (element as any).children() : element.children : [];

    let value = (element as any).data || '';

    if (type === 'text' && value.replace(/\n/g, '') === '') {
      return null;
    }

    const parsed: ParsedElement = {
      type,
      value: value.replace(/\n/g, ''),
      attributes: (element as any).attribs || {},
      children: children.map((child: ChildNode): ParsedElement | null => (this._parseElement(child))).filter((child: ParsedElement | null) => child !== null) as ParsedElement[] || [],
    };

    return parsed;
  }

  /**
   * Finds the first tag after a specific tag in the contents.
   * @param {string} tag The tag to find.
   * @param {string} afterTag The tag to search after.
   * @param {Cheerio<any>} contents The contents to search within.
   * @param {string[]} [match = []] The text to match against.
   * @returns {Cheerio<any> | undefined} The found tag or undefined.
   */
  protected _firstTagAfterTag(
    tag: string,
    afterTag: string,
    contents: Cheerio<any>,
    match: string[] = [],
  ) {
    let found = false;

    for (let i = 0; i < contents.length; i += 1) {
      const content = contents[i];

      if (content.type === 'tag' && content.name === afterTag) {
        if (!match.length) {
          found = true;
        } else {
          const text = 'text' in content ? content.text().trim() : '';
          const data = 'data' in content ? content.data.trim() : '';

          for (let j = 0; j < match.length; j += 1) {
            if (text.includes(match[j]) || data.includes(match[j])) {
              found = true;
              break;
            }
          }

          let children = content && 'children' in content ? typeof content.children === 'function' ? content.children() : content.children : null;

          for (let j = 0; j < children.length; j += 1) {
            const child = children[j];

            if (child.type === 'text') {
              const text = child.data.trim();

              for (let k = 0; k < match.length; k += 1) {
                if (text.includes(match[k])) {
                  found = true;
                  break;
                }
              }
            } else if (child.type === 'tag' && child.name === 'span') {
              const text = child.children[0]?.data?.trim() || '';

              for (let k = 0; k < match.length; k += 1) {
                if (text.includes(match[k])) {
                  found = true;
                  break;
                }
              }
            }
          }

          if (children.length > 0
            && 'children' in children[0]
            && children[0].children.length > 0
            && 'children' in children[0].children[0]
            && children[0].children[0].children.length > 2
            && children[0].children[0].children[2].type === 'tag'
            && children[0].children[0].children[2].name === 'a') {
            const text = children[0].children[0].children[2].attribs.title;

            for (let j = 0; j < match.length; j += 1) {
              if (text.includes(match[j]) || data.includes(match[j])) {
                found = true;
                break;
              }
            }
          }
        }
      }

      if (found && content.type === 'tag' && content.name === tag) {
        return content;
      }
    }
  }

  /**
    * Condenses a table by removing empty cells and combining rows.
    *
    * @param {Record<string, any> | undefined} table The table to condense.
    * @returns {Record<string, any> | undefined} The condensed table.
    */
  protected _condenseTable(table: Record<string, any> | undefined): Record<string, any> | undefined {
    if (!table) {
      return undefined; // No table to condense
    }

    const legend = {} as Record<number, string>;
    const rows = [] as Record<string, any>[];
    let popped = 0;

    for (let i = 0; i < table.body.length; i += 1) {
      const row = table.body[i];
      rows.push({});

      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];

        // If header.
        if (cell.type === 'th' && i === 0) {
          if (rows.length !== i + 1 - popped) {
            rows.pop();
            popped += 1;
          }

          if (cell.value !== '') {
            legend[j] = cell.value;
          } else {
            const children = cell.children || [];

            for (const child of children) {
              if (child.type === 'text' && child.value !== '') {
                legend[j] = child.value;
                break;
              }
            }
          }
        }

        if (cell.type === 'td') {
          const key = legend[j] ? legend[j] : Object.keys(rows[i - popped]).length;
          rows[i - popped][key] = this._condenseInterestingData(cell);
        }
      }
    }

    return {
      header: legend,
      body: rows.filter((row: Record<string, any>) => Object.keys(row).length > 0),
    };
  }

  /**
   * Condenses interesting data from a given object.
   * @param {Record<string, any> | undefined} data The data to condense.
   * @returns {Record<string, any>} The condensed data.
   */
  protected _condenseInterestingData(data: Record<string, any> | undefined): Record<string, any> {
    const obj = {} as Record<string, any>;

    if (!data) {
      return obj;
    }

    if ('type' in data && data.type === 'a' && 'attributes' in data && data.attributes) {
      obj.href = data.attributes.href || '';
    }

    if ('type' in data && data.type === 'img' && 'attributes' in data && data.attributes) {
      obj.src = data.attributes.src || '';
      obj.alt = data.attributes.alt || '';
    }

    if ('type' in data
      && data.type === 'text'
      && 'value' in data
      && data.value
      && data.value !== ''
      && data.value !== '\n'
      && data.value !== ' ') {
      obj.text = data.value.trim() || '';
    }

    if ('children' in data && data.children.length) {
      const children = [] as Record<string, any>[];

      for (const child of data.children) {
        const childObj = this._condenseInterestingData(child);

        for (let key in childObj) {
          if (!(key in obj)) {
            obj[key] = childObj[key];
            continue;
          }

          if (obj[key] instanceof Array && !(obj[key].includes(childObj[key]))) {
            if (childObj[key] instanceof Array) {
              obj[key] = obj[key].concat(childObj[key]);
            } else {
              obj[key].push(childObj[key]);
            }
            continue;
          }

          if (!(obj[key] instanceof Array)) {
            if (childObj[key] instanceof Array) {
              obj[key] = [obj[key]].concat(childObj[key]);
            } else {
              obj[key] = [
                obj[key],
                childObj[key],
              ];
            }
          }
        }
      }
    }

    for (let key in obj) {
      if (obj[key] instanceof Array) {
        obj[key] = obj[key].filter((value: any) => (value !== '' && value !== '\n' && value !== ' '));
      }
    }

    return obj;
  }

  /**
   * Parses the navigation table to extract relevant data.
   *
   * @returns {Record<string, any>} The parsed navigation table.
   */
  protected _parseNavigationTable(): Record<string, any> {
    const table = this._getLast('table.wikitable.mw-collapsible');

    if (!table || table.length === 0) {
      return {}; // No navigation table found
    }

    return this._parseHorizontalTable(table);
  }


  /**
   * Parses any horizontal table from the HTML page.
   *
   * @returns {Record<string, any>} The parsed horizontal table.
   */
  protected _parseHorizontalTable(table: Cheerio<any>): Record<string, any> {
    const contents = typeof table.children === 'function' ? table.children() : table.children;
    let body;

    for (let i = 0; i < contents.length; i += 1) {
      const content = contents[i];

      if (content.type === 'tag' && content.name === 'tbody') {
        body = content;
      }
    }

    if (!body) {
      return {}; // No body found in the table
    }

    const result = {
      header: {} as Record<string, any>,
      body: {} as Record<string, any>,
    } as Record<string, any>;
    const rows = body.children;
    let lastIcon = '';
    let key = '';

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];

      if (row.type !== 'tag' || row.name !== 'tr') {
        continue; // Skip non-tag elements
      }

      const cells = typeof row.children === 'function' ? (row as any).children() : row.children;

      for (let j = 0; j < cells.length; j += 1) {
        const cell = cells[j];

        if (cell.type === 'tag' && cell.name === 'th') {
          const data = cell.children[0] || null;

          if (data && !!data.attribs && !!data.attribs.title) {
            key = data.attribs.title;

            result.header[key] = {
              text: data.attribs.title,
              href: data.attribs.href || '',
            };
            result.body[key] = {};
          }
        } else if (cell.type === 'tag' && cell.name === 'td') {
          const children = typeof cell.children === 'function' ? cell.children() : cell.children;

          for (let i = 0; i < children.length; i += 1) {
            const child = children[i];

            if (child.type === 'tag' && child.name === 'a') {
              const item = child.children[0];

              if (item.type === 'text') {
                const id = item.data.trim().toLowerCase().replace(/\s+/g, '-');

                result.body[key][id] = {
                  id,
                  name: item.data.trim(),
                  href: `${BASE_URL}${child.attribs.href}` || '',
                  icon: lastIcon,
                };
              } else if (item.name === 'img') {
                lastIcon = `${BASE_URL}${item.attribs.src}`;
              }
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Parses the aside section of the page.
   *
   * @returns {Promise<Record<string, any>>} A promise that resolves to the parsed aside data.
   */
  async _parseAside(): Promise<Record<string, any>> {
    const aside = this._getFirst('aside.portable-infobox.pi-background');

    // Check if aside exists
    if (!aside) {
      return {};
    }

    // Get contents of aside
    const contents = typeof aside.children === 'function' ? aside.children() : aside.children;
    const result = {} as Record<string, any>;

    // Iterate through contents to find relevant data
    for (let i = 0; i < contents.length; i += 1) {
      const content = contents[i];

      // Aside titles
      if (content.type === 'tag' && content.name === 'h2') {
        const data = this._parseValue(content);

        if (data) {
          result.name = (data as Record<string, any>).text.trim();
          result.id = result.name.toLowerCase().replace(/\s+/g, '-');
        }
      }

      if (content.type === 'tag'
        && content.name === 'figure'
        && content.attribs.class.includes('pi-media')) {
        const children = content.children;

        for (let j = 0; j < children.length; j += 1) {
          const child = children[j];

          if (child.type === 'tag' && child.name === 'a') {
            for (let k = 0; k < child.children.length; k += 1) {
              const image = child.children[k];

              if (image.type === 'tag' && image.name === 'img') {
                result.image = `${BASE_URL}${image.attribs.src}`;
                break;
              }
            }
          } else if (child.type === 'tag' && child.name === 'figcaption') {
            if (child.children.length > 0 && child.children[0].type === 'text') {
              result.description = child.children[0].data.trim();
            }
          }
        }
      }

      if (content.type === 'tag'
        && content.name === 'section'
        && content.attribs.class.includes('pi-group')) {
        const children = content.children;

        for (let j = 0; j < children.length; j += 1) {
          const child = children[j];

          if (child.type === 'tag'
            && child.name === 'div'
            && child.attribs.class.includes('pi-item')
            && child.children.length > 1) {
            const [
              fill,
              label,
              fill2,
              value,
              ...rest
            ] = child.children;

            let key = (label as Record<string, any>).children[0].data.trim();
            let parsedValue = this._parseValue(
              value,
              key,
            );

            if (key === 'Sources'
              || key === 'Donatable'
              || key === 'Museum Set') {
              continue;
            } else if (key === 'Location') {
              key = 'locations';

              if ((parsedValue as Record<string, any>).text instanceof Array) {
                parsedValue = (parsedValue as Record<string, any>).text.map((location: string) => (location.trim().toLowerCase().replace(/\s+/g, '-')));
              } else {
                parsedValue = [ (parsedValue as Record<string, any>).text.toLowerCase().replace(/\s+/g, '-') ];
              }
            } else if (key === 'Health') {
              key = 'health';

              parsedValue = parseInt((parsedValue as Record<string, any>).text, 10);
            } else if (key === 'Stamina') {
              key = 'stamina';

              parsedValue = parseInt((parsedValue as Record<string, any>).text, 10);
            } else if (key === 'Sell Price') {
              key = 'sell';

              parsedValue = convertTesseraeString((parsedValue as Record<string, any>).text);
            } else if (key === 'Seed') {
              key = 'seed-image';

              parsedValue = (parsedValue as Record<string, any>).src
            } else if (key === 'Season') {
              key = 'seasons';

              if ((parsedValue as Record<string, any>).text instanceof Array) {
                parsedValue = (parsedValue as Record<string, any>).text.map((season: string) => (season.trim().toLowerCase())).filter((season: string) => (['spring', 'summer', 'fall', 'winter'].includes(season)));
              } else {
                parsedValue = [(parsedValue as Record<string, any>).text.trim().toLowerCase()];
              }

              if ((parsedValue as string[]).includes('all')) {
                parsedValue = ['spring', 'summer', 'fall', 'winter'];
              }
            } else if (key === 'Growth Time') {
              key = 'growth-time';

              parsedValue = parseInt((parsedValue as Record<string, any>).text.replace(' Days', ''), 10);
            } else if (key === 'Regrowth Time') {
              key = 'regrow-time';

              parsedValue = parseInt((parsedValue as Record<string, any>).text.replace(' Days', ''), 10);
            }

            result[key] = parsedValue;
          }
        }
      }
    }

    return result;
  }

  /**
   * Parses a value from a child element.
   *
   * @param {ChildNode} element The element to parse.
   * @param {string | undefined} key The key to associate with the value.
   * @returns {Record<string, any> | string | number} The parsed value.
   */
  protected _parseValue(
    element: ChildNode,
    key: string | undefined = undefined,
  ): Record<string, any> | string | number {
    const data = {} as Record<string, any>;

    if (element.type === 'text') {
      data.text = element.data.trim();
    } else if (element.type === 'tag' && element.name === 'a') {
      data.href = `${BASE_URL}${element.attribs.href}`;
      data.title = element.attribs.title || '';
    } else if (element.type === 'tag' && element.name === 'img') {
      data.src = `${BASE_URL}${element.attribs.src}`;
      data.alt = element.attribs.alt || '';
    }

    if ((element as Record<string, any>).children && (element as Record<string, any>).children.length > 0) {
      const children = (element as Record<string, any>).children;

      for (let i = 0; i < children.length; i += 1) {
        const child = this._parseValue(children[i], key);

        if (child && typeof child === 'object') {
          for (const childKey in child) {
            const value = child[childKey];

            if (childKey in data) {
              if (data[childKey] instanceof Array) {
                if (!(data[childKey].includes(value))) {
                  data[childKey].push(...(value instanceof Array ? value : [value]));
                }
              } else if (value !== data[childKey]) {
                data[childKey] = [
                  ...(data[childKey] instanceof Array ? data[childKey] : [data[childKey]]),
                  ...(value instanceof Array ? value : [value]),
                ];
              }
            } else {
              data[childKey] = value;
            }

            if (data[childKey] instanceof Array) {
              data[childKey] = data[childKey].filter((v: any) => (v !== '' && v !== '\n' && v !== ' '));
            }
          }
        }
      }
    }

    return data;
  }
}
