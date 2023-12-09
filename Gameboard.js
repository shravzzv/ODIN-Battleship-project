import { Ship } from './Ship'

/**
 * Factory function for creating a Battleship Gameboard.
 *
 * @returns {Object} - Gameboard object with methods for managing ship placement and attacks.
 */

export const Gameboard = () => {
  /**
   * Array to store information about placed ships on the gameboard.
   * @type {Object[]}
   * @private
   */
  const _shipsState = []

  /**
   * Returns an array of all the indices that a ship occupies.
   *
   * @function
   * @param {string} start - The coordinates of the starting index of the ship, e.g, 'a1', 'j10, etc.
   * @param {number} length - The length of the ship.
   * @param {string} orientation - The orientation of the ship, can be either 'horizontal' or 'vertical'.
   * @returns {string[]} - The indices the ship will occupy on the board.
   * @private
   */
  const _getIndices = (start, length, orientation) => {
    const indices = []

    const startX = start.at(0)
    const startY = start.at(1)
    const startNum = parseInt(startY)

    // Generate indices based on orientation
    if (orientation.includes('h')) {
      for (let i = 0; i < length; i++) {
        indices.push(`${startX}${startNum + i}`)
      }
    } else if (orientation.includes('v')) {
      for (let i = 0; i < length; i++) {
        indices.push(
          `${String.fromCharCode(startX.charCodeAt(0) + i)}${startNum}`
        )
      }
    }

    return indices
  }

  /**
   * Checks if a single index is within the bounds of the game board.
   *
   * @param {string} index - The index to check.
   * @returns {boolean} - True if the index is within bounds, false otherwise.
   * @private
   */
  const _isIndexWithinBounds = (index) => /^[a-j]([1-9]|10)$/.test(index)

  /**
   *  Validates if the incoming ship requires indices which are within the bounds of the game board [a1 -> j10].
   * There's no need to check for diagonal ship placement because the _getIndices cannot actually do that. It returns infintely stratight lines on the board.
   *
   * @function
   * @param {string[]} indices - All the indices the incoming ship requires
   * @returns {boolean} - True if all the indices are within the bounds of the board or else false
   * @private
   */
  const _isWithinBounds = (indices) => indices.every(_isIndexWithinBounds)

  /**
   * Checks if the given indices are already occupied on the gameboard.
   *
   * @param {string[]} indices - The indices to check for occupation.
   * @returns {boolean} - True if the indices are unoccupied, false if any index is already occupied.
   * @private
   */
  const _occupiesEmptyIndices = (indices) =>
    _shipsState.every((ship) =>
      indices.every((index) => !ship.indices.includes(index))
    )

  /**
   * Checks if placing a ship at the given indices would make it adjacent to any existing ship.
   *
   * @param {string[]} indices - The indices where the new ship is to be placed.
   * @param {string} orientation - The orientation of the ship (e.g., 'horizontal' or 'vertical').
   * @returns {boolean} - True if the ship can be placed without being adjacent to any other ship, false otherwise.
   * @private
   */
  const _maintainsNonadjacency = (indices, orientation) =>
    _occupiesEmptyIndices(_getAdjacentIndices(indices, orientation))

  /**
   * Returns an array of all the adjacent indices for a ship.
   *
   * @function
   * @param {string[]} indices - The indices of a ship.
   * @param {string} orientation - The orientation of the ship (e.g., 'horizontal' or 'vertical').
   * @returns {string[]} - The adjacent indices for the ship.
   * @private
   */
  const _getAdjacentIndices = (indices, orientation) => {
    const adjIndices = []

    const start = indices[0]
    const end = indices.at(-1)

    const startX = start.at(0)
    const startY = start.at(1)
    const startNum = parseInt(startY)

    const endX = end.at(0)
    const endY = end.at(1)
    const endNum = parseInt(endY)

    if (orientation.includes('h')) {
      // the left
      adjIndices.push(`${startX}${startNum - 1}`)

      // the right
      adjIndices.push(`${endX}${endNum + 1}`)

      for (let i = startNum - 1; i <= endNum + 1; i++) {
        // the top & top diagonals
        adjIndices.push(`${String.fromCharCode(startX.charCodeAt(0) - 1)}${i}`)
        // the bottom & bottom diagonals
        adjIndices.push(`${String.fromCharCode(startX.charCodeAt(0) + 1)}${i}`)
      }
    } else if (orientation.includes('v')) {
      // the top
      adjIndices.push(
        `${String.fromCharCode(startX.charCodeAt(0) - 1)}${startNum}`
      )

      // the bottom
      adjIndices.push(`${String.fromCharCode(endX.charCodeAt(0) + 1)}${endNum}`)

      for (let i = startX.charCodeAt(0) - 1; i <= endX.charCodeAt(0) + 1; i++) {
        // the left & left diagonals
        adjIndices.push(`${String.fromCharCode(i)}${startNum - 1}`)
        // the right & right diagonals
        adjIndices.push(`${String.fromCharCode(i)}${startNum + 1}`)
      }
    }

    return adjIndices.filter(_isIndexWithinBounds)
  }

  /**
   * Places a ship on the gameboard at the specified coordinates and with the specified orientation.
   *
   * @param {number} shipLength - The length of the ship to be placed.
   * @param {string} start - The coordinates where the starting index ship will be placed, e.g., 'a1', 'j10'
   * @param {string} orientation - The orientation of the ship (e.g., 'horizontal' or 'vertical').
   */
  const placeShip = (start, shipLength, orientation) => {
    const ship = Ship(shipLength)

    const indices = _getIndices(start, shipLength, orientation)

    if (!_isWithinBounds(indices)) {
      throw new Error('Invalid indices: Ship extends the board bounds!')
    }

    if (!_occupiesEmptyIndices(indices)) {
      throw new Error(
        'Invalid indices: Ship cannot be placed over other ships!'
      )
    }

    if (!_maintainsNonadjacency(indices, orientation)) {
      throw new Error(
        'Invalid indices: Ship cannot be placed adjacent to other ships!'
      )
    }

    const shipData = {
      indices,
      ship,
    }

    _shipsState.push(shipData)
  }

  const getShipsState = () => _shipsState

  return {
    placeShip,
    getShipsState,
  }
}
