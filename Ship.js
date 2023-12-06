/**
 * Ship Factory Function
 *
 * @function
 * @param {number} length - The length of the ship.
 * @returns {Object} - A ship object with length and hits properties.
 * @property {number} length - The length of the ship.
 * @property {number} hits - The number of hits the ship has received.
 * @method hit - Increments the number of hits on the ship.
 * @method isSunk - Checks if the ship is sunk based on the number of hits.
 * @method getLength - Retrieves the length of the ship.
 * @method getHits - Retrieves the number of hits the ship has received.
 */

export const Ship = (length) => {
  /**
   * The length of the ship.
   * @type {number}
   * @private
   */
  let _length = length

  /**
   * The number of hits the ship has received.
   * @type {number}
   * @private
   */
  let _hits = 0

  /**
   * Increments the number of hits on the ship.
   *
   * @method
   */
  const hit = () => _hits++

  /**
   * Checks if the ship is considered sunk based on its length and the number of hits it has received.
   *
   * @method
   * @returns {boolean} - True if the ship is sunk, false otherwise.
   */
  const isSunk = () => _hits >= _length

  /**
   * Retrieves the length of the ship.
   *
   * @method
   * @returns {number} - The length of the ship.
   */
  const getLength = () => _length

  /**
   * Retrieves the number of hits the ship has received.
   *
   * @method
   * @returns {number} - The number of hits the ship has received.
   */
  const getHits = () => _hits

  return {
    hit,
    isSunk,
    getLength,
    getHits,
  }
}
