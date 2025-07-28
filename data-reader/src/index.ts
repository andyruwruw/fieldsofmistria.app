// Local Imports
import { CharacterService } from './services/character-service';
import writeToJson from './services/json-writer';

/**
 * Main entry point for the data reader.
 */
const main = async () => {
  console.log('Data Reader is starting...');

  const characterService = new CharacterService();

  const characters = await characterService.fetch();

  writeToJson(
    './characters.json',
    characters,
  );

  console.log('Data reader is completed.');
}

main();
