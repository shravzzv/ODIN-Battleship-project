/**
 * Factory function for creating a Battleship Computer Player.
 *
 * @param {Object} humanGameboard - The Gameboard object of the human player's fleet.
 * @returns {Object} - ComputerPlayer object with methods for making random attacks.
 */
export const ComputerPlayer = (humanGameboard) => {
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
   * Stores the adjacent indices of the last hit.
   *
   * @type {String[]}
   */
  const lastHitAdj = []

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
   *
   * @returns {string} - A random coordinate index, e.g., 'b3'.
   */
  const _getRandomIndex = () => {
    const coordinatesArray = []

    for (let i = 'a'.charCodeAt(0); i <= 'j'.charCodeAt(0); i++) {
      for (let j = 1; j <= 10; j++) {
        coordinatesArray.push(String.fromCharCode(i) + j)
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
  const _getAdjacentIndices = (index) => {
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
   * Returns a valid index for the computer step.
   *
   * @returns {string} index - The computer's choice for the attack.
   *
   */
  const _getIndex = () => {
    let index = _getRandomIndex()

    // todo: When a hit has been made, the next steps should be attacking all of the available surroundings

    // if last attack was a hit, cycle attacking its surrounding indices
    // if (getLastAttack()?.isHit) {
    //   const adjIndices = _getAdjacentIndices(getLastAttack().index)
    //   console.log(adjIndices)
    // }
    // ! Problem: Here, last attack's index changes after each attack.

    if (lastHitAdj.length) {
      index = lastHitAdj.pop()
    }

    // prevent multiple attacks on same index
    while (_attacks.some((attack) => attack.index === index)) {
      index = _getRandomIndex()
      // * why random?
    }

    return index
  }

  /**
   * Makes a attack on the human player's Gameboard.
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
      humanGameboard.receiveAttack(index)

      const isHit = humanGameboard
        .getShipsState()
        .some((item) => item.indices.includes(index))

      _attacks.push({ index, isHit })

      // if isHit, push its unattacked adjacents to lastHitAdj
      if (isHit) {
        const adj = _getAdjacentIndices(index)
        // remove already attacked indices
        const pruned = adj.filter((idx) =>
          getAttacks().every((attack) => attack.index !== idx)
        )
        if (!lastHitAdj.length) lastHitAdj.push(...pruned)

        console.log(lastHitAdj)
      }

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

/**
 * ? How does a human player attack the board?
 * He makes a random attack.
 * If the attack is a miss, he makes another random attack.
 * If the attack is a hit, he attacks one of its surrounding indices.
 *  If the attack is a miss, he attacks another of the hit's surrounding indices.
 *  If the attack is a hit, he goes on attacking in the same direction until he reaches an index which is a miss.
 *    Then he goes back and attacks the index on the other side of the first hit.
 *      If the attack was a miss, he has sunk the ship. He goes back to attacking at random.
 *      If the attack was a hit, he continues attacking in the same direction until he gets a miss.
 *
 */

/**
 * * The computer player may be able to keep track of the attacked ships and their indices, just as a human player would.
 * Create a variable named const startingHits = []
 * or const hits = [{start: 'a4', }]
 */

// todo: When a hit has been made, the next steps should be attacking all of the available surroundings
