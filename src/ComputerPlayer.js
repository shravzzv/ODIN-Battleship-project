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
   * Stores the unattacked adjacent indices of the last hit.
   *
   * @type {String[]}
   */
  const _lastHitAdj = []

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

    if (_lastHitAdj.length) {
      index = _lastHitAdj.pop()
    }

    // prevent multiple attacks on same index
    while (_attacks.some((attack) => attack.index === index)) {
      index = _getRandomIndex()
      // * why random?
    }

    // todo: prevent attacking indices adjacent to ships

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

      if (isHit) {
        const adj = _getAdjacentIndices(index)

        const pruned = adj.filter((idx) =>
          getAttacks().every((attack) => attack.index !== idx)
        )

        if (
          adj.some((idx) =>
            _attacks.some((attack) => idx === attack.index && attack.isHit)
          )
        ) {
          const currentHit = index
          const lastHit = getLastHit()

          // * same row
          if (currentHit.at(0) === lastHit.at(0)) {
            // remove all other row elements from adj
            const otherRowAdjs = pruned.filter(
              (idx) => idx.at(0) !== currentHit.at(0)
            )
            otherRowAdjs.forEach((idx) => {
              const index = pruned.findIndex((i) => i === idx)
              pruned.splice(index, 1)
            })

            // remove all other row elements from _lastAttackAdj
            const otherRowIdxs = _lastHitAdj.filter(
              (idx) => idx.at(0) !== currentHit.at(0)
            )

            otherRowIdxs.forEach((idx) => {
              const index = _lastHitAdj.findIndex((i) => i === idx)
              _lastHitAdj.splice(index, 1)
            })
          } else {
            // same column
            // remove all other column elements from adj
            const otherColAdj = pruned.filter(
              (idx) => idx.slice(1) !== currentHit.slice(1)
            )

            otherColAdj.forEach((idx) => {
              const index = pruned.findIndex((i) => i === idx)
              pruned.splice(index, 1)
            })

            // remove all other column elements from _lastHitAdj
            const otherColIdxs = _lastHitAdj.filter(
              (idx) => idx.slice(1) !== currentHit.slice(1)
            )

            otherColIdxs.forEach((idx) => {
              const index = _lastHitAdj.findIndex((i) => i === idx)
              _lastHitAdj.splice(index, 1)
            })
          }
        }

        _lastHitAdj.push(...pruned)

        console.log(_lastHitAdj)
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

  /**
   *
   * @returns {String | null} - The index of the last hit if there is any or null.
   */
  const getLastHit = () =>
    _attacks
      .slice()
      .reverse()
      .filter((attack) => attack.isHit)[1].index || null

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

// // todo: When a hit has been made, the next steps should be attacking all of the available surroundings
// todo: Choose specific direction of attack after a hit.

// todo: After two successful hits, select the direction of the next attacks, whether they should be in the same row or the same column

// ? ships won't be placed adjacent to other ships, can the computer remember this
