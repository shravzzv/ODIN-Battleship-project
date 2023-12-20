import Header from './components/Header'
import Main from './components/main'
import Footer from './components/Footer'

import StartScreen from './components/StartScreen'
import Arena from './components/Arena'
import EndScreen from './components/Endscreen'

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
   * Displays the home screen of the game.
   * This function initializes the game by appending the header, main content, and footer to the root element.
   * It further appends the start screen to the main content section.
   * @function
   * @returns {void}
   */
  const showHomeScreen = () => {
    _root.appendChild(Header())
    _root.appendChild(Main())
    _root.appendChild(Footer())

    document.querySelector('.main').appendChild(StartScreen())
  }

  /**
   * Display both the player’s boards and renders them using information from their respective boards.
   */
  const renderBoards = (friendlyBoard, enemyBoard) => {
    const mainEl = document.querySelector('.main')
    mainEl.innerHTML = ``
    mainEl.appendChild(Arena())
    // represent ships in the UI
    _displayShipsOnFriendlyBoard(friendlyBoard.getShipsState())
    _displayShipsOnEnemyBoard(enemyBoard.getShipsState())
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
      })
    })

  /**
   * Marks an enemy cell as attacked by adding the 'attacked' class.
   *
   * @param {string} index - The index of the cell.
   * @private
   */
  const markEnemyCellAsAttacked = (index) => {
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
  const markFriendlyCellAsAttacked = (index) => {
    const cell = document.querySelector(
      `.board.friendly .cell[data-index=${index}]`
    )
    cell.classList.add('attacked')
  }

  const showEndScreen = (isWon, name) => {
    const mainEl = document.querySelector('.main')
    mainEl.innerHTML = ``
    mainEl.appendChild(EndScreen(isWon, name))
  }

  return {
    renderBoards,
    markEnemyCellAsAttacked,
    markFriendlyCellAsAttacked,
    showEndScreen,
    showHomeScreen,
  }
})()
