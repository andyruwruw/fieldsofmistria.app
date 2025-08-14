/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  clsx,
  type ClassValue,
} from 'clsx';
import { twMerge } from 'tailwind-merge';

// Local Imports
import artifactsData from '../data/artifacts.json';
import cropsData from '../data/crops.json';
import bugsData from '../data/bugs.json';
import fishData from '../data/fish.json';

// Types
import type { Artifact } from '../types/museum';
import type { Crop } from '../types/crops';
import type { Fish } from '../types/fish';
import type { Bug } from '../types/bugs';

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

/**
 * Resolves an item by its ID.
 *
 * @param {string} id The ID of the item to resolve.
 * @returns {any} The resolved item, or null if not found.
 */
export const resolveItem = (id: string): any => {
  if (id in artifactsData) {
    return (artifactsData as unknown as Record<string, Artifact>)[id];
  } else if (id in bugsData) {
    return (bugsData as unknown as Record<string, Bug>)[id];
  } else if (id in cropsData) {
    return (cropsData as unknown as Record<string, Crop>)[id];
  } else if (id in fishData) {
    return (fishData as unknown as Record<string, Fish>)[id];
  }

  return null;
}
