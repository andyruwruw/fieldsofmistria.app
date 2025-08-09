// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { ArtifactPageParser } from '../parsers/artifact.parser';
import { fetchPage } from '../utils/scraper';

// Types
import { Artifact } from '../models/artifacts';

/**
 * Service for managing artifact data.
 */
export class ArtifactsService {
  /**
   * List of URLs to check.
   */
  protected static _list = [] as string[];

  /**
   * Adds an artifact URL to the list.
   *
   * @param url The URL of the artifact.
   */
  static addArtifact(url: string): void {
    this._list.push(url);
  }

  /**
   * Fetches animal data for all animals.
   *
   * @returns {Promise<Artifact[]>} A promise that resolves to an array of Artifact objects.
   */
  async fetch(): Promise<Artifact[]> {
    const artifacts = [] as Artifact[];
    let last = 0;

    for (let i = 0; i < ArtifactsService._list.length; i += 1) {
      const url = ArtifactsService._list[i];

      const percent = Math.floor((i / ArtifactsService._list.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Artifacts`);
      }

      artifacts.push(await this.fetchArtifact(url));
    }

    return artifacts;
  }

  /**
   * Fetches artifact data from a specific URL.
   *
   * @param url The URL of the artifact page.
   * @returns A promise that resolves to the fetched Artifact object.
   */
  async fetchArtifact(url: string): Promise<Artifact> {
    const page = await fetchPage(url);

    const parser = new ArtifactPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}