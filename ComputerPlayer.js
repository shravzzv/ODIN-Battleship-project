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
   * Retrieves all the valid surrounding indices of a given index.
   *
   * @param {string} index - The index whose surrounding indices are wanted.
   * @returns {string[]} - All the valid surrounding indices of the index.
   */
  const _getAllAdjacentIndices = (index) => {
    const indices = []

    const startX = index.at(0)
    const startY = index.slice(1)
    const startNum = parseInt(startY)

    indices.push(
      // left
      `${startX}${startNum - 1}`,
      // right
      `${startX}${startNum + 1}`,
      // top
      `${String.fromCharCode(startX.charCodeAt(0) - 1)}${startY}`,
      // bottom
      `${String.fromCharCode(startX.charCodeAt(0) + 1)}${startY}`
    )

    return indices.filter((index) => /^[a-j]([1-9]|10)$/.test(index))
  }

  /**
   * Retrieves an unattacked adjacent index of the last attack, allowing the computer to grope for ships.
   *
   * @returns {string} - The next target index.
   * @private
   */
  const _getLastAttackAdjacent = () => {
    const lastAttackIndex = getLastAttack().index

    const adjacentNonAttackedIndices = _getAllAdjacentIndices(
      lastAttackIndex
    ).filter((index) => !_attacks.includes(index))

    return adjacentNonAttackedIndices[0]
  }

  /**
   * Returns a valid index for the next computer step.
   *
   * @returns {string} index - The computer's choice for the next attack.
   *
   */
  const _getIndex = () => {
    let index

    if (getLastAttack()?.isHit) {
      index = _getLastAttackAdjacent()
    } else {
      index = _getRandomIndex()
    }

    // this makes the computer unable to attack on an index twice
    while (_attacks.some((attack) => attack.index === index)) {
      index = _getRandomIndex()
    }

    return index
  }

  /**
   * Makes a random attack on the human player's Gameboard.
   *
   * @throws {Error} - Throws an error if the attack is invalid.
   * @returns {string} - The attack result.
   */
  const attack = () => {
    try {
      if (_attacks.length === 100) {
        throw new Error('Invalid attack: All 100 cells have been attacked!')
      }

      const index = _getIndex()
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
