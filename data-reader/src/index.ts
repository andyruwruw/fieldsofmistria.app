// Local Imports
import { convertArrayToObjectWithIds } from './utils/convert';
import writeToJson from './utils/json-writer';
import { CharactersService } from './services/characters.service';
import { ArtifactsService } from './services/artifacts.service';
import { AnimalsService } from './services/animals.service';
import { FishesService } from './services/fishes.service';
import { MuseumService } from './services/museum.service';
import { SkillsService } from './services/skills.service';
import { DishesService } from './services/dishes.service';
import { CropsService } from './services/crops.service';
import { BugsService } from './services/bugs.service';
import { SpellsService } from './services/spells.service';
import { WeatherService } from './services/weather.service';
import { FestivalsService } from './services/festivals.service';
import { MonstersService } from './services/monsters.service';
import { ToolsService } from './services/tools.service';
import { EquipmentService } from './services/equipment.service';
import { CosmeticsService } from './services/cosmetics.service';
import { WeaponsService } from './services/weapons.service';
import { MaterialsService } from './services/materials.service';
import { FurnitureService } from './services/furniture.service';
import { InfusionsService } from './services/infusions.service';
import { LocationsService } from './services/locations.service';
import { QuestsService } from './services/quests.service';
import { RanchingService } from './services/ranching.service';
import { BlacksmithingService } from './services/blacksmithing.service';

/**
 * A single scrapeable category: a name (for `--only=`) and the work to do.
 */
interface CategoryTask {
  /**
   * Category name, used to select it via `--only=<name>[,<name>...]`.
   */
  name: string;

  /**
   * Fetches the category and writes its `export/*.json` file(s).
   */
  run: () => Promise<void>;
}

/**
 * Every scrapeable category. Run all of them with `npm run start`, or a
 * subset with `npm run start -- --only=monsters,weapons`.
 */
const TASKS: CategoryTask[] = [
  {
    name: 'characters',
    run: async () => {
      const characters = await new CharactersService().fetch();
      writeToJson('export/characters.json', convertArrayToObjectWithIds(characters));
    },
  },
  {
    name: 'bugs',
    run: async () => {
      const bugs = await new BugsService().fetch();
      writeToJson('export/bugs.json', convertArrayToObjectWithIds(bugs));
    },
  },
  {
    name: 'animals',
    run: async () => {
      const animals = await new AnimalsService().fetch();
      writeToJson('export/animals.json', convertArrayToObjectWithIds(animals));
    },
  },
  {
    name: 'crops',
    run: async () => {
      const crops = await new CropsService().fetch();
      writeToJson('export/crops.json', convertArrayToObjectWithIds(crops));
    },
  },
  {
    name: 'museum',
    run: async () => {
      const museum = await new MuseumService().fetch();
      writeToJson('export/museum.json', museum);
    },
  },
  {
    name: 'artifacts',
    run: async () => {
      const artifacts = await new ArtifactsService().fetch();
      writeToJson('export/artifacts.json', convertArrayToObjectWithIds(artifacts));
    },
  },
  {
    name: 'fish',
    run: async () => {
      const fish = await new FishesService().fetch();
      writeToJson('export/fish.json', convertArrayToObjectWithIds(fish));
    },
  },
  {
    name: 'skills',
    run: async () => {
      const skills = await new SkillsService().fetch();
      writeToJson('export/skills.json', convertArrayToObjectWithIds(skills));
    },
  },
  {
    name: 'dishes',
    run: async () => {
      const dishes = await new DishesService().fetch();
      writeToJson('export/dishes.json', dishes);
    },
  },
  {
    name: 'spells',
    run: async () => {
      const spells = await new SpellsService().fetch();
      writeToJson('export/spells.json', convertArrayToObjectWithIds(spells));
    },
  },
  {
    name: 'weather',
    run: async () => {
      const weather = await new WeatherService().fetch();
      writeToJson('export/weather.json', convertArrayToObjectWithIds(weather));
    },
  },
  {
    name: 'festivals',
    run: async () => {
      const festivals = await new FestivalsService().fetch();
      writeToJson('export/festivals.json', convertArrayToObjectWithIds(festivals));
    },
  },
  {
    name: 'monsters',
    run: async () => {
      const monsters = await new MonstersService().fetch();
      writeToJson('export/monsters.json', convertArrayToObjectWithIds(monsters));
    },
  },
  {
    name: 'tools',
    run: async () => {
      const tools = await new ToolsService().fetch();
      writeToJson('export/tools.json', convertArrayToObjectWithIds(tools));
    },
  },
  {
    name: 'equipment',
    run: async () => {
      const equipment = await new EquipmentService().fetch();
      writeToJson('export/equipment.json', convertArrayToObjectWithIds(equipment));
    },
  },
  {
    name: 'cosmetics',
    run: async () => {
      const cosmetics = await new CosmeticsService().fetch();
      writeToJson('export/cosmetics.json', convertArrayToObjectWithIds(cosmetics));
    },
  },
  {
    name: 'weapons',
    run: async () => {
      const weapons = await new WeaponsService().fetch();
      writeToJson('export/weapons.json', convertArrayToObjectWithIds(weapons));
    },
  },
  {
    name: 'materials',
    run: async () => {
      const materials = await new MaterialsService().fetch();
      writeToJson('export/materials.json', convertArrayToObjectWithIds(materials));
    },
  },
  {
    name: 'furniture',
    run: async () => {
      const furniture = await new FurnitureService().fetch();
      writeToJson('export/furniture.json', convertArrayToObjectWithIds(furniture));
    },
  },
  {
    name: 'infusions',
    run: async () => {
      const infusions = await new InfusionsService().fetch();
      writeToJson('export/infusions.json', convertArrayToObjectWithIds(infusions));
    },
  },
  {
    name: 'locations',
    run: async () => {
      const locations = await new LocationsService().fetch();
      writeToJson('export/locations.json', convertArrayToObjectWithIds(locations));
    },
  },
  {
    name: 'quests',
    run: async () => {
      const quests = await new QuestsService().fetch();
      writeToJson('export/quests.json', convertArrayToObjectWithIds(quests));
    },
  },
  {
    name: 'ranching',
    run: async () => {
      const { products, cosmetics } = await new RanchingService().fetch();
      writeToJson('export/ranching.json', {
        products: convertArrayToObjectWithIds(products),
        cosmetics: convertArrayToObjectWithIds(cosmetics),
      });
    },
  },
  {
    name: 'blacksmithing',
    run: async () => {
      const blacksmithing = await new BlacksmithingService().fetch();
      writeToJson('export/blacksmithing.json', {
        recipes: convertArrayToObjectWithIds(blacksmithing.recipes),
        'skill-perks': convertArrayToObjectWithIds(blacksmithing['skill-perks']),
      });
    },
  },
];

/**
 * Reads `--only=<name>[,<name>...]` off argv, if present.
 *
 * @param {string[]} argv - `process.argv`.
 * @returns {string[] | null} The requested category names, or null for "all".
 */
const getOnlyFilter = (argv: string[]): string[] | null => {
  const flag = argv.find((arg) => arg.startsWith('--only='));

  return flag ? flag.slice('--only='.length).split(',') : null;
};

/**
 * Main entry point for the data reader.
 */
const main = async () => {
  console.log('Data Reader is starting...');

  const only = getOnlyFilter(process.argv);
  const tasks = only ? TASKS.filter((task) => only.includes(task.name)) : TASKS;

  if (only) {
    const unknown = only.filter((name) => !TASKS.some((task) => task.name === name));

    if (unknown.length) {
      console.log(`Unknown categories: ${unknown.join(', ')}`);
    }
  }

  for (const task of tasks) {
    console.log(`--- ${task.name} ---`);

    try {
      await task.run();
    } catch (error) {
      console.log(`FAILED: ${task.name}`, error);
    }
  }

  console.log('Data reader is completed.');
}

main();
