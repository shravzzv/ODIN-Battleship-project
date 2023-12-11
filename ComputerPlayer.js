/**
 * Factory function for creating a Battleship Computer Player.
 *
 * @param {Object} enemyGameboard - The Gameboard object of the human player's fleet.
 * @returns {Object} - ComputerPlayer object with methods for making random attacks.
 */
export const ComputerPlayer = (enemyGameboard) => {
  /**
   * Array to store information about all the attacks.
   *
   * @type {Object[]} - Array of indices representing the coordinates of attacks.
   * @property {string} index - The index on the board where the attack was made.
   * @property {boolean} isHit - True if the attack hit a ship, otherwise false.
   * @private
   */
  const _attacks = []

  /**
   * Generates a random integer between a specified range, inclusive.
   *
   * @param {number} min - The minimum value of the range.
   * @param {number} max - The maximum value of the range.
   * @returns {number} - A random integer within the specified range.
   * @private
   *
   * Credit: The MDN Web Docs.
   */
  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * Generates a random index from the array of coordinates on a standard Battleship game board (from 'a1' to 'j10').
   * The computer is unable to generate indices out of the board.
   *
   * @returns {string} - A random coordinate index, e.g., 'b3'.
   */
  const _getRandomIndex = () => {
    const coordinatesArray = []

    for (let i = 'a'.charCodeAt(0); i <= 'j'.charCodeAt(0); i++) {
      for (let j = 1; j <= 10; j++) {
        const coordinate = String.fromCharCode(i) + j
        coordinatesArray.push(coordinate)
      }
    }

    return coordinatesArray.at(_getRandomIntInclusive(0, 99))
  }


  /**
   * Makes a random attack on the human player's Gameboard.
   *
   * @throws {Error} - Throws an error if the attack is invalid.
   * @returns {string} - The attack result.
   */
  const attack = () => {
    try {
      let index

      if (_attacks.length === 100) {
        throw new Error('Invalid attack: All 100 cells have been attacked!')
      }

      const lastAttack = getLastAttack()

      if (lastAttack && lastAttack.isHit) {
        index = _getAdjacentIndex()
      } else {
        index = _getRandomIndex()
      }

      // this makes the computer unable to attack on an index twice
      while (_attacks.some((attack) => attack.index === index)) {
        index = _getRandomIndex()
      }

      enemyGameboard.receiveAttack(index)

      const isHit = enemyGameboard
        .getShipsState()
        .some((item) => item.indices.includes(index))

      _attacks.push({ index, isHit })

      return `Computer attacked at ${index}`
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Returns information about all the attacks the computer has made.
   *
   * @returns {Object[]} - All the computer attacks.
   */
  const getAttacks = () => _attacks

  /**
   * Returns information about the last attack the computer has made.
   *
   * @returns {Object} - The last attack of the computer.
   */
  const getLastAttack = () => _attacks.at(-1)

  return {
    attack,
    getAttacks,
    getLastAttack,
  }
}

// todo: Test the best cases first
// // ? Computer should attack a random index
// // ? Computer should not attack an already attacked index (computer is unable to generate a duplicate index)
// // ? Computer should be able to hit a ship
// ? if an attack hits a ship, it should be smart enough to grope for the ship by attacking the next indices
