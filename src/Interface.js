import Header from './components/Header'
import Arena from './components/Arena'
import Footer from './components/Footer'
import {
  friendlyPlayer,
  friendlyBoard,
  enemyPlayer,
  enemyBoard,
} from './Gameloop'

/**
 * Module for DOM interaction.
 *
 * @returns {Object} - Interface object with methods for DOM manipulation.
 */
export const Interface = (() => {
  /**
   * Reference to the root element in the DOM where the game interface is rendered.
   *
   * @type {HTMLElement}
   */
  const _root = document.querySelector('#root')

  /**
   * Initializes the DOM interface by appending necessary components and adding default event listeners.
   */
  const initialize = () => {
    // Append components to the root element
    _root.appendChild(Header())
    _root.appendChild(Arena())
    _root.appendChild(Footer())

    // represent ships in the UI
    _displayShipsOnFriendlyBoard(friendlyBoard.getShipsState())
    _displayShipsOnEnemyBoard(enemyBoard.getShipsState())

    // Add default event listeners to enemy board cells
    document
      .querySelectorAll('.board.enemy .cell')
      .forEach((cell) => cell.addEventListener('click', _handleCellClick))
  }

  /**
   * Handles the click event on an enemy board cell.
   *
   * @param {Event} e - The click event object.
   * @private
   */
  const _handleCellClick = (e) => {
    // prevent attacking an already attacked index
    if (e.target.classList.contains('attacked')) {
      return
    }

    // Extract the data-index attribute to determine the cell index
    const index = e.target.attributes['data-index'].value

    // Friendly player performs an attack on the specified index
    friendlyPlayer.attack(index)

    // Marks the clicked enemy cell as attacked in the UI
    _markEnemyCellAsAttacked(index)

    // Enemy player performs an attack
    enemyPlayer.attack()

    // Marks the friendly cell as attacked in the UI after after a short delay
    setTimeout(() => {
      _markFriendlyCellAsAttacked(enemyPlayer.getLastAttack().index)
    }, 300)

    // Checks and displays the winner based on the game status and remove the event listener if there is a winner
    if (_checkWinner(friendlyBoard, enemyBoard)) {
      document
        .querySelectorAll('.board.enemy .cell')
        .forEach((cell) => cell.removeEventListener('click', _handleCellClick))
    }
  }

  /**
   * Marks an enemy cell as attacked by adding the 'attacked' class.
   *
   * @param {string} index - The index of the cell.
   * @private
   */
  const _markEnemyCellAsAttacked = (index) => {
    const cell = document.querySelector(
      `.board.enemy .cell[data-index=${index}]`
    )
    cell.classList.add('attacked')
  }

  /**
   * Marks a friendly cell as attacked by adding the 'attacked' class.
   *
   * @param {string} index - The index of the cell.
   */
  const _markFriendlyCellAsAttacked = (index) => {
    const cell = document.querySelector(
      `.board.friendly .cell[data-index=${index}]`
    )
    cell.classList.add('attacked')
  }

  /**
   * Represents the ships present on the friendly gameboard in logic in the UI.
   *
   * @param {Object[]} shipsState - The shipState object from the friendly's gameboard.
   */
  const _displayShipsOnFriendlyBoard = (shipsState) =>
    shipsState.forEach((item) => {
      let { indices } = item
      indices.forEach((index) => {
        let cell = document.querySelector(
          `.board.friendly .cell[data-index=${index}]`
        )
        cell.classList.add('ship')
        cell.textContent = '🛳️'
      })
    })

  /**
   * Represents the ships present on the enemy gameboard in logic in the UI.
   *
   * @param {Object[]} shipsState - The shipState object from the enemy's gameboard.
   */
  const _displayShipsOnEnemyBoard = (shipsState) =>
    shipsState.forEach((item) => {
      let { indices } = item
      indices.forEach((index) => {
        let cell = document.querySelector(
          `.board.enemy .cell[data-index=${index}]`
        )
        cell.classList.add('ship')
        cell.textContent = '🛳️'
      })
    })

  /**
   * Displays the winner based on the game status.
   *
   * @param {Object} friendlyBoard - The friendly player's gameboard.
   * @param {Object} enemyBoard - The enemy player's gameboard.
   * @returns {boolean} - True if there is a winner, otherwise false.
   */
  const _checkWinner = (friendlyBoard, enemyBoard) => {
    if (friendlyBoard.areAllShipsSunk() || enemyBoard.areAllShipsSunk()) {
      setTimeout(() => {
        friendlyBoard.areAllShipsSunk()
          ? alert('OOPS! The enemy sunk all your ships!')
          : alert('HURRAY! You sunk all the enemy ships! Bravo!')
      }, 400)
      return true
    }
    return false
  }

  return {
    initialize,
  }
})()
