// Packages
import * as cheerio from 'cheerio';

/**
 * Parser class for extracting structured data from HTML pages.
 */
export abstract class Parser<T> {
  /**
   * The Cheerio instance representing the HTML page to parse.
   */
  protected _page: cheerio.CheerioAPI;

  /**
   * The URL of the page being parsed.
   */
  protected _url: string;

  /**
   * Constructs a new Parser instance.
   *
   * @param {string} url The URL of the page being parsed.
   * @param {cheerio.CheerioAPI} page The Cheerio instance representing the HTML page to parse.
   */
  constructor(
    url: string,
    page: cheerio.CheerioAPI,
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
}
