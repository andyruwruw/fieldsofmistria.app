/**
 * Wait for a given amount of time.
 * 
 * @param {number} [ms = 1000] Milliseconds to wait.
 * @returns {Promise<void>} Promise that will resolve after a set amount of time.
 */
const wait = (ms = 1000) => new Promise((resolve) => (setTimeout(resolve, ms)));

export default wait;
