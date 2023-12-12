import Header from './components/Header'
import Arena from './components/Arena'
import Footer from './components/Footer'

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
  const initialize = (
    friendlyPlayer,
    enemyPlayer,
    friendlyBoard,
    enemyBoard
  ) => {
    // Append components to the root element
    _root.appendChild(Header())
    _root.appendChild(Arena())
    _root.appendChild(Footer())

    // Add default event listeners to enemy board cells
    document
      .querySelectorAll('.board.enemy .cell')
      .forEach((cell) =>
        cell.addEventListener('click', (e) => _handleCellClick(e, enemyPlayer))
      )
  }

  /**
   * Handles the click event on an enemy board cell.
   *
   * @param {Event} e - The click event.
   * @private
   */
  const _handleCellClick = (e, enemyPlayer) => {
    const index = e.target.attributes['data-index'].value
    _markEnemyCellAsAttacked(index)

    enemyPlayer.attack()
    _markFriendlyCellAsAttacked(enemyPlayer.getLastAttack().index)
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
  const placeShipsOnFriendlyBoard = (shipsState) =>
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
  const placeShipsOnEnemyBoard = (shipsState) =>
    shipsState.forEach((item) => {
      let { indices } = item
      indices.forEach((index) => {
        let cell = document.querySelector(
          `.board.enemy .cell[data-index=${index}]`
        )
        cell.classList.add('ship')
        // cell.textContent = '🛳️'
      })
    })

  return {
    initialize,
    placeShipsOnEnemyBoard,
    placeShipsOnFriendlyBoard,
  }
})()
