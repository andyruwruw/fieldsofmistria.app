// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { ToolPageParser } from '../parsers/tool.parser';
import { ToolListParser } from '../parsers/tool-list.parser';
import { TOOLS_URL } from '../config';
import { fetchAll, fetchPage } from '../utils/scraper';

// Types
import { Tool } from '../models/tools';

/**
 * Service for managing tool data.
 */
export class ToolsService {
  /**
   * Fetches tool data for all tools.
   *
   * @returns {Promise<Tool[]>} A promise that resolves to an array of Tool objects.
   */
  async fetch(): Promise<Tool[]> {
    const toolUrls = (await this._getToolList()).map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(toolUrls, async (url: string, i: number): Promise<Tool> => {
      const percent = Math.floor((i / toolUrls.length) * 10);

      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Tools`);
      }

      return this._getToolPage(url);
    });

    console.log(`100% | Done Fetching Tools`);

    return result;
  }

  /**
   * Fetches a list of tool URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of tool list entries.
   */
  async _getToolList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(TOOLS_URL);

    const parser = new ToolListParser(
      TOOLS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a single tool.
   *
   * @param {string} url The tool's page URL.
   * @returns {Promise<Tool>} A promise that resolves to a Tool object.
   */
  async _getToolPage(url: string): Promise<Tool> {
    const page = await fetchPage(url);

    const parser = new ToolPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
