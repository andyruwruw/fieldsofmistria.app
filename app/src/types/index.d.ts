/**
 * Gender types.
 */
type Gender = 'Male' | 'Female' | 'Unknown';

/**
 * Character species types.
 */
type CharacterSpecies = 'Human' | 'Chicken' | 'Dog';

/**
 * Character interface.
 */
interface Character {
  id: string;
  name: string;
  gender: Gender;
  dateable: boolean;
  image: string;
  icon: string;
  "birthday-season": string;
  "birthday-day": number;
  species: CharacterSpecies;
  occupation: string;
  loved: string[];
  liked: string[];
  disliked: string[];
  hated: string[];
}
