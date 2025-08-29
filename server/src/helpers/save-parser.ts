// Local Imports
import {
  decimalToTwelveHourTime,
  twelveHourTimeToDecimal,
} from './convert';
import museumData from '../data/museum.json';
import dishesData from '../data/dishes.json';

// Types
import {
  ParsedData,
  CharacterData,
  LocationsData,
  LocationData,
  DateData,
  CharactersData,
  OverallStats,
  MuseumData,
  MuseumProgress,
  MuseumWingSetProgress,
  MinesData,
  MinesFloor,
  MinesRun,
  MinesSeal,
} from '../types';
import {
  FieldsOfMistriaIncome,
  FieldsOfMistriaItemsSoldLog,
  FieldsOfMistriaRenownLevelUp,
  FieldsOfMistriaSetCompletion
} from '../types/fields-of-mistria/game-stats';
import { FieldsOfMistriaSaveData } from '../types/fields-of-mistria';
import { FieldsOfMistriaMinesFloor } from '../types/fields-of-mistria/mines';

/**
 * Digests the save file data.
 */
export default class FieldsOfMistriaSaveParser {
  /**
   * Save file data.
   */
  private _data: FieldsOfMistriaSaveData;

  /**
   * Instantiates a new FieldsOfMistriaSaveParser.
   *
   * @param {FieldsOfMistriaSaveData} data The save file data.
   */
  constructor(data: FieldsOfMistriaSaveData) {
    this._data = data;
  }

  /**
   * Parses the save file data.
   *
   * @returns An object containing the parsed data.
   */
  parse(): ParsedData {
    return {
      locations: this._parseLocations(),
      characters: this._parseCharacters(),
      data: this._parseOverallStats(),
      museum: this._parseMuseumStats(),
      mines: this._parseMinesStats(),
      // dishes: this._parseDishesStats(),
      // Dishes
      // Forgeables
      // Millables
      // Refined
      // Sells
      // Woodcraftables
      // Dives
      // Fish Caught
      // Bugs Caught
      // Animals
      // Crops Harvested
      // Digs done
      // Forageable harvests
      // skills
    };
  }

  protected _parseDishesStats() {
    const data = {} as Record<string, any>;

    for (let dish of Object.values(dishesData.dishes)) {
      console.log(dish.id);
    }

    return data;
  }

  /**
   * Parses out locational data.
   *
   * @returns {LocationsData} An object containing the parsed location data.
   */
  protected _parseLocations(): LocationsData {
    const data = {} as LocationsData;

    const locationVisits = this._data.game_stats.location_visits;
    const ids = Object.keys(locationVisits);

    const lostItems = this._data.gamedata.lost_items;

    for (const id of ids) {
      let locationLostItems = [];

      if (id in lostItems) {
        locationLostItems = lostItems[id].map((lostItems: any) => {
          if (!('items' in lostItems)) {
            return [];
          }

          return lostItems.items.map((item: any) => (item.item_id));
        }).flat();
      }

      data[id] = {
        id,
        visits: locationVisits[id] || 0,
        lostItems: locationLostItems,
      } as LocationData;
    }

    return data;
  }

  /**
   * Parses the character data.
   *
   * @returns {CharactersData} An object containing the parsed character data.
   */
  protected _parseCharacters (): CharactersData {
    const data = {
      dates: {
        photos: this._data.date_photos.photos,
        history: this._data.player.date_history,
        unlocks: this._data.player.date_unlocks,
      } as DateData,
    } as CharactersData;

    const npcIds = Object.keys(this._data.npcs);

    const scenes = {} as Record<string, string[]>;
    for (let scene of this._data.gamedata.scene_history as string[] || []) {
      for (let id of npcIds) {
        if (scene.toLowerCase().includes(id.toLowerCase())) {
          if (id in scenes) {
            scenes[id].push(scene);
          } else {
            scenes[id] = [ scene ];
          }
        }
      }
    }

    const conversations = {} as Record<string, Record<string, number>>;
    for (let conversation of Object.keys(this._data.game_stats.conversations) || [] as string[]) {
      for (let id of npcIds) {
        if (conversation.toLowerCase().includes(id.toLowerCase())) {
          if (!(id in conversations)) {
            conversations[id] = {};
          }
          conversations[id][conversation] = this._data.game_stats.conversations[conversation];
        }
      }
    }

    const gifts = {} as Record<string, Record<string, string | number>[]>;
    for (let gift of (this._data.game_stats.gifts_given as Record<string, string | number>[]) || []) {
      if (gift.npc in gifts) {
        gifts[gift.npc].push(gift);
      } else {
        gifts[gift.npc] = [ gift ];
      }
    }

    const spokenCount = this._data.game_stats.npcs_spoken_to;
    const facts = this._data.gamedata.t2_world_facts;

    for (const id of npcIds) {
      const {
        currentRouting, // Null or object.
        outfit, // 'autumn
        times_spoken_today,
        location_position,
        heart_points,
        gift_flag,
        talk_flag,
        gifts_given,
      } = this._data.npcs[id];

      let shootingStarAttended = 0;
      if (`shooting_star_${id}_attended` in facts) {
        shootingStarAttended = facts[`shooting_star_${id}_attended`];
      }
      let shootingStar = 0;
      if (`cutscene_seen_shooting_star_${id}` in facts) {
        shootingStar = facts[`cutscene_seen_shooting_star_${id}`];
      }
      let shootingStarFestival = 0;
      if (`has_been_to_shooting_star_festival_with_${id}` in facts) {
        shootingStarFestival = facts[`has_been_to_shooting_star_festival_with_${id}`];
      }

      let harvestFestival = 0;
      if (`has_been_to_harvest_festival_with_${id}` in facts) {
        harvestFestival = facts[`has_been_to_harvest_festival_with_${id}`];
      }
      let harvestFestivalDancePartner = facts['harvest_festival_dance_partner'] === id;

      let hasMet = 0;
      if (`${id}_has_met` in facts) {
        hasMet = facts[`${id}_has_met`];
      }

      let seenTwoHeartCutscene = 0;
      if (`cutscene_seen_${id}_two_hearts` in facts) {
        seenTwoHeartCutscene = facts[`cutscene_seen_${id}_two_hearts`];
      }
      let seenFourHeartCutscene = 0;
      if (`cutscene_seen_${id}_four_hearts` in facts) {
        seenFourHeartCutscene = facts[`cutscene_seen_${id}_four_hearts`];
      }
      let seenSixHeartCutscene = 0;
      if (`cutscene_seen_${id}_six_hearts` in facts) {
        seenSixHeartCutscene = facts[`cutscene_seen_${id}_six_hearts`];
      }
      let seenEightHeartCutscene = 0;
      if (`cutscene_seen_${id}_eight_hearts` in facts) {
        seenEightHeartCutscene = facts[`cutscene_seen_${id}_eight_hearts`];
      }

      const birthday = facts[`${id}_birthday`] || 0;

      let postEightHeartRomanticProgression = 0;
      if (`${id}_post_8h_romantic_progression` in facts) {
        postEightHeartRomanticProgression = facts[`${id}_post_8h_romantic_progression`];
      }
      let postEightHeartRomanticGrouping = 0;
      if (`${id}_post_8h_romantic_grouping` in facts) {
        postEightHeartRomanticGrouping = facts[`${id}_post_8h_romantic_grouping`];
      }
      let postEightHeartRomanticGate = 0;
      if (`${id}_post_8h_romantic_gate` in facts) {
        postEightHeartRomanticGate = facts[`${id}_post_8h_romantic_gate`];
      }
      let postEightHeartBestFriendGrouping = 0;
      if (`${id}_post_8h_best_friend_grouping` in facts) {
        postEightHeartBestFriendGrouping = facts[`${id}_post_8h_best_friend_grouping`];
      }
      let postEightHeartBestFriendGate = 0;
      if (`${id}_post_8h_best_friend_gate` in facts) {
        postEightHeartBestFriendGate = facts[`${id}_post_8h_best_friend_gate`];
      }

      let eightHeartPriorityBump = 0;
      if (`${id}_eight_heart_priority_bump` in facts) {
        eightHeartPriorityBump = facts[`${id}_eight_heart_priority_bump`];
      }

      let lastSpokenTo = 0;
      if (`${id}_was_last_spoken_to` in facts) {
        lastSpokenTo = facts[`${id}_was_last_spoken_to`];
      }

      data[id] = {
        id,
        routing: currentRouting || null,
        outfit: outfit || '',
        spokenToday: times_spoken_today || 0,
        spokenCount: spokenCount[id] || 0,
        location: location_position.location_id || '',
        hearts: facts[`${id}_heart_level`] || 0,
        heartPoints: heart_points || 0,
        giftFlag: gift_flag || false,
        talkFlag: talk_flag || false,
        giftsGiven: gifts_given || [],
        conversations: conversations[id] || {},
        gifts: gifts[id] || [],
        scenes: scenes[id] || [],
        shootingStarAttended: shootingStarAttended || 0,
        shootingStar: shootingStar || 0,
        shootingStarFestival: shootingStarFestival || 0,
        lastSpokenTo,
        harvestFestival,
        harvestFestivalDancePartner,
        hasMet,
        seenTwoHeartCutscene,
        seenFourHeartCutscene,
        seenSixHeartCutscene,
        seenEightHeartCutscene,
        heartEvent: facts[`${id}_heart_event`] || null,
        birthday,
        postEightHeartRomanticProgression,
        postEightHeartRomanticGrouping,
        postEightHeartRomanticGate,
        postEightHeartBestFriendGrouping,
        postEightHeartBestFriendGate, 
        eightHeartPriorityBump,
      } as CharacterData;
    }

    return data;
  }

  /**
   * Parses the overall stats from the game data.
   *
   * @returns {OverallStats} The parsed overall stats.
   */
  protected _parseOverallStats(): OverallStats {
    const {
      playtime: playtimeRaw,
      calendar,
      name,
      farm,
      stats,
    } = this._data.header;

    const {
      renown,
      essence,
      free_baths: freeBaths,
      base_health: baseHealth,
      base_stamina: baseStamina,
      invulnerable_hits: invulnerableHits,
      gold,
      stamina_current: stamina,
      mana_current: mana,
      health_current: health,
      mana_max: maxMana,
    } = stats;

    const {
      faints,
      items_cooked: itemsCooked,
      items_eaten: itemsEaten,
      items_forged: itemsForged,
      items_milled: itemsMilled,
      items_refined: itemsRefined,
      items_sold_each_day: itemsSoldEachDay,
      npcs_spoken_to: npcsSpokenTo,
      items_woodcrafted: itemsWoodcrafted,
      dives,
      gifts_given: giftsGiven,
      fish_caught: fishCaught,
      fish_missed: fishMissed,
      bugs_caught: bugsCaught,
      animals,
      renown_level_ups: renownLevelUps,
      wishing_well_uses: wishingWellUses,
      crop_harvests: cropHarvests,
      chicken_statue_uses: chickenStatueUses,
      digs,
      forageable_harvests: forageableHarvests,
      income,
      tree_harvests: treeHarvests,
      gross_essence: grossEssence,
    } = this._data.game_stats;

    const {
      day_time_speed: dayTimeSpeed,
      random_seed: seed,
      farm_expanded: farmExpanded,
    } = this._data.gamedata;

    const hours = Math.floor(playtimeRaw / 60 / 60);
    const minutes = Math.floor((playtimeRaw / 60) % 60);
    const playtime = `${hours}h ${minutes}m`;

    const grossGold = income.reduce((
        acc: number,
        curr: FieldsOfMistriaIncome,
      ) => (acc + curr.amount),
      0,
    ) || 0;

    const renownLevel = renownLevelUps.reduce((
        acc: number,
        curr: FieldsOfMistriaRenownLevelUp,
      ) => (Math.max(
        acc,
        curr.level,
      )),
      0,
    ) || 0;

    const itemsSold = itemsSoldEachDay.reduce((
        acc: number,
        curr: FieldsOfMistriaItemsSoldLog[],
      ) => (acc + curr.reduce((
          innerAcc: number,
          innerCurr: FieldsOfMistriaItemsSoldLog,
        ) => (innerAcc + innerCurr.count),
        0,
      )),
      0,
    ) || 0;

    const speakCount = Object.values(npcsSpokenTo as Record<string, number>).reduce((
      acc: number,
      curr: number,
    ) => (acc + curr),
    0) || 0;

    const data = {
      seed,
      playtime,
      playtimeRaw,
      calendar,
      dayTimeSpeed,
      name,
      farm,
      baseHealth,
      baseStamina,
      maxMana,
      health,
      stamina,
      mana,
      renown,
      renownLevel,
      essence,
      grossEssence,
      gold,
      grossGold,
      faints,
      freeBaths,
      invulnerableHits,
      farmExpanded,
      itemsCooked: itemsCooked.length || 0,
      itemsEaten: itemsEaten.length || 0,
      itemsForged: itemsForged.length || 0,
      itemsMilled: itemsMilled.length || 0,
      itemsRefined: itemsRefined.length || 0,
      itemsSold: itemsSold || 0,
      npcsSpokenTo: speakCount || 0,
      itemsWoodcrafted: itemsWoodcrafted.length || 0,
      dives: dives.length || 0,
      giftsGiven: giftsGiven.length || 0,
      fishCaught: fishCaught.length || 0,
      fishMissed,
      bugsCaught: bugsCaught.length || 0,
      animals: animals.length || 0,
      wishingWellUses: wishingWellUses.length || 0,
      cropHarvests: cropHarvests.length || 0,
      chickenStatueUses: chickenStatueUses.length || 0,
      digs: digs.length || 0,
      averageBedtime: this._parseAverageBedtime(),
      forageableHarvests: forageableHarvests.length || 0,
      treeHarvests: treeHarvests.length || 0,
    } as OverallStats;

    return data;
  }

  /**
   * Parses the museum progress from the game data.
   *
   * @returns {MuseumData} The parsed museum stats data.
   */
  protected _parseMuseumStats(): MuseumData {
    // Progress
    const progress = {} as MuseumProgress;
    for (let wing of museumData.wings) {
      progress[wing.id] = {
        setCount: 0,
        itemCount: 0,
        setsDone: 0,
        itemsDone: 0,
        sets: {} as Record<string, MuseumWingSetProgress>,
      };
    }

    const WING_MAPPING = {
      archaeology: 'archaeology-wing',
      fish: 'fish-wing',
      flora: 'flora-wing',
      insects: 'insects-wing',
      insect: 'insects-wing',
    } as Record<string, string>;

    const items = this._data.gamedata.museum_progress.map((itemId: string) => (itemId.replace('_', '-')));
    const sets = this._data.game_stats.set_completions.reduce((
      acc: Record<string, any>,
      set: FieldsOfMistriaSetCompletion,
    ) => {
      const id = set.set.replace('_', '-');

      if (WING_MAPPING[set.wing] in acc) {
        acc[WING_MAPPING[set.wing]].push(id);
      } else {
        acc[WING_MAPPING[set.wing]] = [id];
      }

      return acc;
    }, {});

    for (let wingId in (museumData.sets as Record<string, any>)) {
      const wing = (museumData.sets as Record<string, any>)[wingId];

      for (const set of wing) {
        progress[wingId].setCount += 1;
        progress[wingId].itemCount += (set.items as string[]).length;

        const setProgress = {
          id: set.id,
          items: {} as Record<string, boolean>,
          done: false,
        } as MuseumWingSetProgress;

        let done = false;

        // Is this set marked as done?
        if (sets[wingId].includes(set.id)) {
          done = true;
        }

        let allItemsDone = true;

        for (const item of (set.items as string[])) {
          setProgress.items[item] = items.includes(item) || done;

          if (items.includes(item) || done) {
            progress[wingId].itemsDone += 1;
          }

          if (!done) {
            allItemsDone = allItemsDone && items.includes(item);
          }
        }

        if (!done && allItemsDone) {
          done = true;
        }

        setProgress.done = done;

        if (done) {
          progress[wingId].setsDone += 1;
        }

        progress[wingId].sets[set.id as string] = setProgress;
      }
    }

    return {
      count: this._data.gamedata.t2_world_facts.museum_total_count,
      completedItems: items,
      completedSets: sets,
      progress,
    } as MuseumData;
  }

  /**
   * Parses the mines progress from the game data.
   *
   * @returns {MinesData} The parsed mines stats data.
   */
  protected _parseMinesStats(): MinesData {
    const { maximum_mines_level: level } = this._data.gamedata;

    const {
      enemies_killed: enemiesKilled,
      deaths,
      location_visits,
      current_mines_run: currentsRun,
      mines_data: minesData,
    } = this._data.game_stats;

    const { mines_entry } = location_visits;

    const floors = {} as Record<number, MinesFloor>;
    const runs = [] as MinesRun[];

    for (let i = 0; i < minesData.length; i++) {
      const run = minesData[i] as FieldsOfMistriaMinesFloor;

      const killed = {} as Record<string, number>;
      const bugsCaught = [];
      const rocksBroken = [];
      const forageables = [];
      const monsters = [];
      let digsites = 0;
      let damage = 0;

      for (let j = 0; j < run.floor_data.length; j++) {
        const floor = run.floor_data[j];

        bugsCaught.push(...floor.bugs_caught);
        rocksBroken.push(...floor.rocks_broken);
        forageables.push(...floor.forageables_harvested);
        monsters.push(...floor.monsters_spawned);
        digsites += floor.digsites;
        
        for (let enemy of Object.keys(floor.enemy_kill)) {
          if (enemy in killed) {
            killed[enemy] += floor.enemy_kill[enemy];
          } else {
            killed[enemy] = floor.enemy_kill[enemy];
          }
        }

        let damageForFloor = 0;

        for (let floorDamage of floor.damages) {
          damage += floorDamage.damage_taken;
          damageForFloor += floorDamage.damage_taken;
        }

        if (floor.current_floor in floors) {
          floors[floor.current_floor].runs++;

          floors[floor.current_floor].bugsCaught.push(...floor.bugs_caught);
          floors[floor.current_floor].rocksBroken.push(...floor.rocks_broken);
          floors[floor.current_floor].forageables.push(...floor.forageables_harvested);
          floors[floor.current_floor].monsters.push(...floor.monsters_spawned);
          floors[floor.current_floor].digsites += floor.digsites;
          floors[floor.current_floor].damage += damageForFloor;

          for (let key in floor.enemy_kill) {
            if (key in floors[floor.current_floor].enemiesKilled) {
              floors[floor.current_floor].enemiesKilled[key] += floor.enemy_kill[key];
            } else {
              floors[floor.current_floor].enemiesKilled[key] = floor.enemy_kill[key];
            }
          }
        } else {
          floors[floor.current_floor] = {
            bugsCaught: floor.bugs_caught,
            rocksBroken: floor.rocks_broken,
            forageables: floor.forageables_harvested,
            monsters: floor.monsters_spawned,
            digsites: floor.digsites,
            enemiesKilled: floor.enemy_kill,
            runs: 1,
            damage: damageForFloor,
          } as MinesFloor;
        }
      }

      runs.push({
        day: run.day_entered,
        time: run.time_start,
        status: run.status,
        entered: run.floor_data[0].current_floor,
        exited: run.floor_data[run.floor_data.length - 1].current_floor,
        bugsCaught,
        rocksBroken,
        digsites,
        forageables,
        killed,
        monsters,
        damage,
      } as MinesRun);
    }

    return {
      level: level || 0,
      enemiesKilled: enemiesKilled || 0,
      deaths: deaths || 0,
      entered: mines_entry || 0,
      currentRun: currentsRun || null,
      runs,
      floors,
      seals: this._parseSeals(),
    } as MinesData;
  }

  /**
   * Parses the average bedtime from the game data.
   *
   * @returns The parsed average bedtime.
   */
  protected _parseAverageBedtime(): string {
    const { bedtimes } = this._data.game_stats;

    return decimalToTwelveHourTime(bedtimes.map((bedtime: string) => (twelveHourTimeToDecimal(bedtime))).reduce((
        a: number,
        b: number,
      ) => (a + b),
      0,
    ) / bedtimes.length);
  }

  /**
   * Parses the seals from the game data.
   *
   * @returns {Record<string, any>} The parsed seals.
   */
  protected _parseSeals(): Record<string, MinesSeal> {
    const { seals } = this._data.gamedata;
    const result = {} as Record<string, MinesSeal>;

    for (const seal in seals) {
      const items = {} as Record<string, number>;

      for (let item of seals[seal]) {
        if (!item.item) {
          continue;
        }
        items[item.item.item_id] = item.count;
      }

      result[seal] = {
        id: seal,
        items,
      } as MinesSeal;
    }

    return result;
  }
}


