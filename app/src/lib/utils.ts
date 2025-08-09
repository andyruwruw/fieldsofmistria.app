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
