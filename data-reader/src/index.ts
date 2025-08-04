// Local Imports
import { convertArrayToObjectWithIds } from './utils/convert';
import { CharactersService } from './services/characters.service';
import { AnimalsService } from './services/animals.service';
import { FishesService } from './services/fishes.service';
import { MuseumService } from './services/museum.service';
import { CropsService } from './services/crops.service';
import { BugsService } from './services/bugs.service';
import writeToJson from './utils/json-writer';

/**
 * Main entry point for the data reader.
 */
const main = async () => {
  console.log('Data Reader is starting...');

  const characterService = new CharactersService();
  const characters = await characterService.fetch();

  writeToJson(
    'export/characters.json',
    convertArrayToObjectWithIds(characters),
  );

  const bugService = new BugsService();
  const bugs = await bugService.fetch();
  
  writeToJson(
    'export/bugs.json',
    convertArrayToObjectWithIds(bugs),
  );

  const animalService = new AnimalsService();
  const animals = await animalService.fetch();

  writeToJson(
    'export/animals.json',
    convertArrayToObjectWithIds(animals),
  );

  const cropService = new CropsService();
  const crops = await cropService.fetch();

  writeToJson(
    'export/crops.json',
    convertArrayToObjectWithIds(crops),
  );

  const museumService = new MuseumService();
  const museum = await museumService.fetch();

  writeToJson(
    'export/museum.json',
    museum,
  );

  const fishService = new FishesService();
  const fish = await fishService.fetch();

  writeToJson(
    'export/fish.json',
    fish,
  );

  console.log('Data reader is completed.');
}

main();
