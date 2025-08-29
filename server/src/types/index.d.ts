// Packages
import {
  NextFunction,
  Request,
  Response,
} from 'express';

/**
 * Basic object type.
 */
export type Dictionary<T> = Record<string, T>;

/**
 * API request object.
 */
export interface ServerRequest extends Request {
  file?: Express.Multer.File;

  filename?: string;
}

/**
 * API response object.
 */
export type ServerResponse = Response;

/**
 * Middleware function for Express.
 */
export type Middleware = ((
  req?: ServerRequest,
  res?: ServerResponse,
  next?: NextFunction,
) => Promise<void> | void)
| ((
  req: ServerRequest,
  res: ServerResponse,
  next: NextFunction,
) => Promise<void> | void)
| NextFunction
| RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

/**
 * Various request types.
 */
export type RequestType = 'get'
| 'patch'
| 'post'
| 'delete';

/**
 * Handler upload type.
 */
export type UploadType = 'none'
| 'save';

export interface ParsedData {
  locations: LocationsData;

  characters: CharactersData;

  data: OverallStats;

  museum: MuseumData;

  mines: MinesData;
}

export interface LocationsData {
  [key: string]: LocationData;
}

export interface LocationData {
  id: string;

  visits: number;

  lostItems: string[];
}

export interface CharactersData {
  dates: DateData;

  [key: string]: CharacterData;
}

export interface DateData {
  photos: any[];

  history: any[];

  unlocks: any[];
}

export interface CharacterData {
  birthday: number;

  conversations: Record<string, number>;

  eightHeartPriorityBump: number;

  giftFlag: boolean;

  gifts: FieldsOfMistriaGiftGivenLog[];

  giftsGiven: string[];

  harvestFestival: number;

  harvestFestivalDancePartner: boolean;

  hasMet: number;

  heartEvent: any;

  heartPoints: number;

  hearts: number;

  id: string;

  lastSpokenTo: number;

  location: string;

  outfit: string;

  postEightHeartBestFriendGate: number;

  postEightHeartBestFriendGrouping: number;

  postEightHeartRomanticGate: number;

  postEightHeartRomanticGrouping: number;

  postEightHeartRomanticProgression: number;

  routing: any;

  scenes: string[];

  seenTwoHeartCutscene: number;

  seenFourHeartCutscene: number;

  seenSixHeartCutscene: number;

  seenEightHeartCutscene: number;

  shootingStar: number;

  shootingStarAttended: number;

  shootingStarFestival: number;

  spokenCount: number;

  spokenToday: number;

  talkFlag: boolean;
}

export interface OverallStats {
  seed : string;

  playtime: string;

  playtimeRaw: number;
  
  calendar: number;
  
  dayTimeSpeed: string;
  
  name: string;
  
  farm: string;
  
  baseHealth: number;
  
  baseStamina: number;
  
  maxMana: number;
  
  health: number;
  
  stamina: number;
  
  mana: number;
  
  renown: number;
  
  renownLevel: number;
  
  essence: number;
  
  grossEssence: number;
  
  gold: number;
  
  grossGold: number;
  
  faints: number;
  
  freeBaths: number;
  
  invulnerableHits: number;
  
  farmExpanded: boolean;
  
  itemsCooked: number;
  
  itemsEaten: number;
  
  itemsForged: number;
  
  itemsMilled: number;
  
  itemsRefined: number;
  
  itemsSold: number;
  
  npcsSpokenTo: number;
  
  itemsWoodcrafted: number;
  
  dives: number;
  
  giftsGiven: number;
  
  fishCaught: number;
  
  fishMissed: number;
  
  bugsCaught: number;
  
  animals: number;
  
  wishingWellUses: number;
  
  cropHarvests: number;
  
  chickenStatueUses: number;
  
  digs: number;
  
  averageBedtime: string;
  
  forageableHarvests: number;
  
  treeHarvests: number;
}

export interface MuseumData {
  count: number;

  completedItems: string[];

  completedSets: MuseumCompletedSets;

  progress: MuseumProgress;
}

export interface MuseumCompletedSets {
  [key: string]: string[];
}

export interface MuseumProgress {
  [key: string]: MuseumWingProgress;
}

export interface MuseumWingProgress {
  setCount: number;

  itemCount: number;

  setsDone: number;

  itemsDone: number;

  sets: Record<string, MuseumWingSetProgress>;
}

export interface MuseumWingSetProgress {
  done: boolean;

  id: string;

  items: Record<string, boolean>;
}

export interface MinesData {
  currentRun: any;

  deaths: number;

  enemiesKilled: number;

  entered: number;

  floors: Record<number, MinesFloor>;

  level: number;

  runs: MinesRun[];

  seals: Record<string, MinesSeal>;
}

export interface MinesFloor {
  bugsCaught: string[];

  damage: number;

  digsites: number;

  enemiesKilled: Record<string, number>;

  forageables: string[];

  monsters: string[];

  rocksBroken: string[];

  runs: number;
}

export interface MinesRun {
  bugsCaught: string[];

  damage: number;

  day: number;

  digsites: number;

  entered: number;

  exited: number;

  forageables: string[];

  killed: Record<string, number>;

  monsters: string[];

  rocksBroken: string[];

  status: string;

  time: number;
}

export interface MinesSeal {
  id: string;

  items: Record<string, number>;
}