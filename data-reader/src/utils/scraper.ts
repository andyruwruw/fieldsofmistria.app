// Packages
import axios from 'axios';
import * as cheerio from 'cheerio';

// Local Imports
import wait from './wait';

/**
 * Fetches the HTML content of a given URL, retrying with exponential
 * backoff on HTTP 429 (the wiki's Cloudflare rate limiter). Every category
 * scraper goes through this, so the backoff protects all of them.
 *
 * @param {string} url The URL of the page to scrape.
 * @param {number} [attempt=0] Internal retry counter.
 * @returns {Promise<cheerio.CheerioAPI>} A Cheerio instance representing the loaded HTML.
 */
export const fetchPage = async (url: string, attempt = 0): Promise<cheerio.CheerioAPI> => {
  try {
    const { data } = await axios.get(url);

    return cheerio.load(data);
  } catch (error) {
    const isRateLimited = axios.isAxiosError(error) && error.response?.status === 429;

    if (isRateLimited && attempt < 5) {
      const backoff = 1000 * (2 ** attempt);

      console.log(`429 from ${url}, backing off ${backoff}ms (attempt ${attempt + 1}/5)`);

      await wait(backoff);

      return fetchPage(
        url,
        attempt + 1,
      );
    }

    console.error(`Error fetching page: ${url}`, error);
    throw error;
  }
}

/**
 * Fetches a set of URLs sequentially with a delay between each request,
 * to stay under the wiki's rate limit. Use this instead of
 * `Promise.all(urls.map(fetchDetailPage))`, which fires every request at
 * once and reliably triggers 429s once a category has more than a handful
 * of items.
 *
 * @template T
 * @param {string[]} urls The URLs to fetch, in order.
 * @param {(url: string, index: number) => Promise<T>} handler Per-URL work (fetch + parse).
 * @param {number} [delayMs=750] Delay between requests, in milliseconds.
 * @returns {Promise<T[]>} The results, in the same order as `urls`.
 */
export const fetchAll = async <T>(
  urls: string[],
  handler: (url: string, index: number) => Promise<T>,
  delayMs = 750,
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < urls.length; i += 1) {
    results.push(await handler(urls[i], i));

    if (i < urls.length - 1) {
      await wait(delayMs);
    }
  }

  return results;
}
