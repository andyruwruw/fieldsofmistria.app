// Types
import { Crop } from './crops';
import { Dish } from './dishes';
import { Fish } from './fish';
import { Tool } from './tools';
import { Bug } from './bugs';

/**
 * Represents an item in the game.
 */
export type Item = Crop
| Dish
| Fish
| Tool
| Bug;
