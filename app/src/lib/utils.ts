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
