// Local Imports
import { HEART_VALUES } from '../config/fields-of-mistria';

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
 * Converts a 12-hour time string to a decimal representation that starts at 6AM and ends at 2AM.
 *
 * @param {string} time The 12-hour time string (e.g., "2:30 PM").
 * @returns {number} The decimal representation of the time.
 */
export const twelveHourTimeToDecimal = (time: string): number => {
  const isAm = time.toLowerCase().includes('am');
  let [
    hour,
    minute,
  ] = time.replace(/(am|pm)/i, '').split(':').map(Number);

  if (hour === 12 && isAm) {
    hour = 0;
  }

  if (!isAm) {
    hour += 12;
  } if (isAm && hour <= 2) {
    hour += 24;
  }

  hour -= 6;

  return (hour + (minute / 60)) / 20;
};

/**
 * Converts a decimal time representation to a 12-hour format string.
 *
 * @param {number} decimal The decimal time representation (e.g., 0.5 for 12:00 PM).
 * @returns {string} The 12-hour format time string.
 */
export const decimalToTwelveHourTime = (decimal: number): string => {
  let hours = Math.floor(decimal * 20);
  const minutes = Math.round(decimal * 20 * 60) % 60;

  // Bring back to real times.
  hours += 6;

  let isAm = true;
  if (hours > 24) {
    hours -= 24;
  } else if (hours >= 12) {
    isAm = false;
    hours -= 12;
  }

  return `${hours}:${minutes.toString().padStart(2, '0')}${isAm ? 'am' : 'pm'}`;
};

