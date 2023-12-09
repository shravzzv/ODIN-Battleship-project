import { Ship } from './Ship'

/**
 * Factory function for creating a Battleship Gameboard.
 *
 * @returns {Object} - Gameboard object with methods for managing ship placement and attacks.
 */

export const Gameboard = () => {
  /**
   * Array to store information about placed ships on the gameboard.
   * @type {Object[]} - Array of ship data objects.
   * @property {string[]} indices - Array of indices occupied by the ship.
   * @property {Object} ship - Ship object representing the placed ship.
   * @private
   */
  const _shipsState = []

  /**
   * Array to store information about all received attacks.
   * @type {String[]} - Array of indices representing the coordinates of received attacks.
   * @private
   */
  const _receivedAttacks = []

  /**
   * Array to store information about received attacks which did not hit any ship.
   * @type {String[]} - Array of indices representing the coordinates of missed attacks.
   * @private
   */
  const _missedAttacks = []

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
      // the left adjacent
      adjIndices.push(`${startX}${startNum - 1}`)

      // the right adjacent
      adjIndices.push(`${endX}${endNum + 1}`)

      for (let i = startNum - 1; i <= endNum + 1; i++) {
        // the top & top diagonals
        adjIndices.push(`${String.fromCharCode(startX.charCodeAt(0) - 1)}${i}`)
        // the bottom & bottom diagonals
        adjIndices.push(`${String.fromCharCode(startX.charCodeAt(0) + 1)}${i}`)
      }
    } else if (orientation.includes('v')) {
      // the top adjacent
      adjIndices.push(
        `${String.fromCharCode(startX.charCodeAt(0) - 1)}${startNum}`
      )

      // the bottom adjacent
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
   * @throws {Error} - Throws an error if the placement violates any rules.
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

  /**
   * Retrieves the current state of ships on the gameboard.
   *
   * @function
   * @returns {Object[]} - An array containing information about placed ships on the board.
   */
  const getShipsState = () => _shipsState

  /**
   * Processes an attack on the gameboard at the specified index.
   *
   * @function
   * @param {string} index - The index representing the coordinates of the attack, e.g., 'a1', 'j10'.
   * @throws {Error} - Throws an error if the index has already been attacked.
   */
  const receiveAttack = (index) => {
    if (_receivedAttacks.includes(index)) {
      throw new Error('Invalid index: Cannot attack an already attacked index!')
    }

    const target = _shipsState.find((ship) => ship.indices.includes(index))

    target ? target.ship.hit() : _missedAttacks.push(index)
    _receivedAttacks.push(index)
  }

  /**
   * Retrieves the array containing indices of missed attacks on the gameboard.
   *
   * @function
   * @returns {String[]} - An array of indices representing the coordinates of missed attacks.
   */
  const getMissedAttacks = () => _missedAttacks

  /**
   * Checks if all ships on the gameboard have been sunk.
   *
   * @function
   * @returns {boolean} - True if all ships are sunk, false otherwise.
   */
  const areAllShipsSunk = () =>
    _shipsState.length > 0 && _shipsState.every((item) => item.ship.isSunk())

  return {
    placeShip,
    getShipsState,
    receiveAttack,
    getMissedAttacks,
    areAllShipsSunk,
  }
}
