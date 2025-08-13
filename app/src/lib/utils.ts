// Packages
import {
  clsx,
  type ClassValue,
} from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string.
 *
 * @param inputs Class values to merge.
 */
export const combineNames = (...inputs: ClassValue[]) => (twMerge(clsx(inputs)));

/**
 * Format a number with commas as thousands separators.
 *
 * @param num The number to format.
 * @returns The formatted number as a string.
 */
export const commaNumber = (num: number): string => {
  if (num === undefined || num === null) {
    return '0';
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Heart values for relationship progression.
 */
const HEART_VALUES = [
  80,
  180,
  280,
  390,
  530,
  705,
  900,
  1125,
  1400,
  1755,
];

/**
 * Get the number of hearts for a given relationship value.
 *
 * @param value The relationship value.
 * @returns The number of hearts.
 */
export const getHeartCount = (value: number): number => {
  for (let i = 0; i < HEART_VALUES.length; i++) {
    if (value < HEART_VALUES[i]) {
      return i;
    }
  }

  return HEART_VALUES.length;
}
