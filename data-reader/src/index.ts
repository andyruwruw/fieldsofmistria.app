// Local Imports
import { convertArrayToObjectWithIds } from './utils/convert';
import { CharactersService } from './services/characters.service';
import { ArtifactsService } from './services/artifacts.service';
import { AnimalsService } from './services/animals.service';
import { FishesService } from './services/fishes.service';
import { MuseumService } from './services/museum.service';
import { SkillsService } from './services/skills.service';
import { DishesService } from './services/dishes.service';
import { CropsService } from './services/crops.service';
import { BugsService } from './services/bugs.service';
import writeToJson from './utils/json-writer';
import { SpellsService } from './services/spells.service';
import { WeatherService } from './services/weather.service';
import { FestivalsService } from './services/festivals.service';

/**
 * Main entry point for the data reader.
 */
const main = async () => {
  console.log('Data Reader is starting...');

  // const characterService = new CharactersService();
  // const characters = await characterService.fetch();

  // writeToJson(
  //   'export/characters.json',
  //   convertArrayToObjectWithIds(characters),
  // );

  // const bugService = new BugsService();
  // const bugs = await bugService.fetch();
  
  // writeToJson(
  //   'export/bugs.json',
  //   convertArrayToObjectWithIds(bugs),
  // );

  // const animalService = new AnimalsService();
  // const animals = await animalService.fetch();

  // writeToJson(
  //   'export/animals.json',
  //   convertArrayToObjectWithIds(animals),
  // );

  // const cropService = new CropsService();
  // const crops = await cropService.fetch();

  // writeToJson(
  //   'export/crops.json',
  //   convertArrayToObjectWithIds(crops),
  // );

  // const museumService = new MuseumService();
  // const museum = await museumService.fetch();

  // writeToJson(
  //   'export/museum.json',
  //   museum,
  // );

  // const artifactsService = new ArtifactsService();
  // const artifacts = await artifactsService.fetch();

  // writeToJson(
  //   'export/artifacts.json',
  //   convertArrayToObjectWithIds(artifacts),
  // );

  // const fishService = new FishesService();
  // const fish = await fishService.fetch();

  // writeToJson(
  //   'export/fish.json',
  //   convertArrayToObjectWithIds(fish),
  // );

  // const skillsService = new SkillsService();
  // const skills = await skillsService.fetch();

  // writeToJson(
  //   'export/skills.json',
  //   convertArrayToObjectWithIds(skills),
  // );

  // const dishService = new DishesService();
  // const dishes = await dishService.fetch();

  // writeToJson(
  //   'export/dishes.json',
  //   dishes,
  // );

  // const spellsService = new SpellsService();
  // const spells = await spellsService.fetch();

  // writeToJson(
  //   'export/spells.json',
  //   convertArrayToObjectWithIds(spells),
  // );

  // const weatherService = new WeatherService();
  // const weather = await weatherService.fetch();

  // writeToJson(
  //   'export/weather.json',
  //   convertArrayToObjectWithIds(weather),
  // );

  const festivalsService = new FestivalsService();
  const festivals = await festivalsService.fetch();

  writeToJson(
    'export/festivals.json',
    convertArrayToObjectWithIds(festivals),
  );

  // Monsters

  // Tools

  // Weapons

  // Equipment

  // Cosmetics

  // Ranching

  // Materials

  // Furniture

  // Blacksmithing

  // Infusion

  console.log('Data reader is completed.');
}

main();
