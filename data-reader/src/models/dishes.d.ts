/**
 * Defines the structure of a dish in the game.
 */
export interface DishIngredient {
  /**
   * Unique identifier for the ingredient.
   */
  id: string;

  /**
   * The amount of this ingredient required for the dish.
   */
  amount: number;
}

/**
 * Represents a dish in the game.
 */
export interface Dish {
  /**
   * Unique identifier for the dish.
   */
  id: string;

  /**
   * Name of the dish.
   */
  name: string;

  /**
   * Description of the dish.
   */
  description: string;

  /**
   * The amount of health restored by the dish.
   */
  health: number;

  /**
   * The amount of stamina restored by the dish.
   */
  stamina: number;

  /**
   * The category of the dish.
   */
  category: string;

  /**
   * The selling price of the dish.
   */
  sell: number;

  /**
   * The ingredients required to make the dish.
   */
  ingredients: DishIngredient[];

  /**
   * The time it takes to cook the dish (in minutes).
   */
  time: number;

  /**
   * The number of stars the dish has.
   */
  stars: number;

  /**
   * The skill level required to cook the dish.
   */
  level: number;

  /**
   * The kitchen tier required to cook the dish.
   */
  tier: number;

  /**
   * The source of the recipe.
   */
  source: string;

  /**
   * The image of the dish.
   */
  image: string;

  /**
   * Link to the dish's wiki page.
   */
  href: string;
}
