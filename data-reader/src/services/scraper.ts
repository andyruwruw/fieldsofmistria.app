// Packages
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetches the HTML content of a given URL.
 *
 * @param {string} url The URL of the page to scrape.
 * @returns {Promise<cheerio.CheerioAPI>} A Cheerio instance representing the loaded HTML.
 */
export const fetchPage = async (url: string): Promise<cheerio.CheerioAPI> => {
  try {
    const { data } = await axios.get(url);

    return cheerio.load(data);
  } catch (error) {
    console.error(`Error fetching page: ${url}`, error);
    throw error;
  }
}
