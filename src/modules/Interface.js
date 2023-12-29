import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'
import StartScreen from '../components/StartScreen'
import Arena from '../components/Arena'
import EndScreen from '../components/EndScreen'
import ShipsPlacingScreen from '../components/ShipsPlacingScreen'
import gameLoop from '../Gameloop'
import { Gameboard } from './Gameboard'
import getRandomShipPlacement from '../utils/randomShipPlacement'

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
  const _SHIP_SYMBOL = '🛳️'

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

    document.querySelector('.startForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const playerName = e.target.elements.playerName.value.trim()
      if (!playerName) return
      showShipsPlacingScreen(playerName)
    })
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

    document.querySelector('.board.enemy').classList.add('active')
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
        cell.textContent = _SHIP_SYMBOL
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

  /**
   * Displays the end screen of the game.
   *
   * @param {boolean} isWon - Indicates whether the game was won by the player.
   * @param {string} name - The player's name.
   */
  const showEndScreen = (isWon, name) => {
    const mainEl = document.querySelector('.main')
    mainEl.innerHTML = ``
    mainEl.appendChild(EndScreen(isWon, name))
    document
      .querySelector('#restart')
      .addEventListener('click', () => showShipsPlacingScreen(name))
  }

  /**
   * Displays the screen for placing ships.
   *
   * @param {string} name - The player's name.
   */
  const showShipsPlacingScreen = (name) => {
    const main = document.querySelector('.main')
    main.innerHTML = ''
    main.appendChild(ShipsPlacingScreen(name))
    enableShipsPlacementScreenEventListeners(name)
  }

  /**
   * Displays the placed ships on the game board.
   *
   * @param {Object[]} shipsState - The shipState object from the gameboard.
   */
  const showPlacedShips = (shipsState) =>
    shipsState.forEach((item) => {
      let { indices } = item
      indices.forEach((index) => {
        let cell = document.querySelector(`.cell[data-index=${index}]`)
        cell.textContent = _SHIP_SYMBOL
      })
    })

  /**
   * Signals that it's the enemy's turn.
   */
  const signalEnemyTurn = () => {
    document.querySelector('.board.friendly').classList.add('active')
    document.querySelector('.board.enemy').classList.remove('active')
  }

  /**
   * Signals that it's the player's turn.
   */
  const signalPlayerTurn = () => {
    document.querySelector('.board.friendly').classList.remove('active')
    document.querySelector('.board.enemy').classList.add('active')
  }

  /**
   * Places event listeners on the ships placement screen.
   *
   * @param {string} playerName
   */
  const enableShipsPlacementScreenEventListeners = (playerName) => {
    const cells = document.querySelectorAll('.cell')
    const continueBtn = document.querySelector('#continue')
    const resetBtn = document.querySelector('#reset')
    const randomBtn = document.querySelector('#random')
    const ships = document.querySelectorAll('.shipContainer')
    const playerBoard = Gameboard()
    const shipsTracker = []

    // change ship orientation on click
    ships.forEach((ship) =>
      ship.addEventListener('click', (e) => {
        const orientation = e.target.getAttribute('data-orientation')
        e.target.setAttribute(
          'data-orientation',
          orientation === 'h' ? 'v' : 'h'
        )
        e.target.classList.toggle('vertical')
      })
    )

    // allows ships to be dragged, and send data during drag
    ships.forEach((ship) =>
      ship.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('plain-text', e.target.id)
        e.dataTransfer.setData('number', e.target.getAttribute('data-length'))
        e.dataTransfer.setData(
          'text',
          e.target.getAttribute('data-orientation')
        )

        // todo: Make ship dragging image match the correct orientation
        e.dataTransfer.setDragImage(e.target, 0, 0)
      })
    )

    // remove ships placed on the board
    ships.forEach((ship) =>
      ship.addEventListener('dragend', (e) => {
        if (shipsTracker.includes(e.target.id)) e.target.remove()
      })
    )

    cells.forEach((cell) =>
      cell.addEventListener('dragenter', (e) =>
        e.target.classList.add('highlight')
      )
    )

    cells.forEach((cell) =>
      cell.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
    )

    // if a ship is already present, keep the highlight or else remove it
    cells.forEach((cell) => {
      cell.addEventListener('dragleave', (e) => {
        const index = e.target.attributes['data-index'].value

        if (shipsTracker.length < 1) e.target.classList.remove('highlight')
        else {
          if (
            playerBoard
              .getShipsState()
              .every((item) => !item.indices.includes(index))
          ) {
            e.target.classList.remove('highlight')
          }
        }
      })
    })

    cells.forEach((cell) =>
      cell.addEventListener('drop', (e) => {
        const id = e.dataTransfer.getData('plain-text')
        const orientation = e.dataTransfer.getData('text')
        const length = parseInt(e.dataTransfer.getData('number'))
        const startIndex = e.target.attributes['data-index'].value

        if (!length && !orientation) return
        if (playerBoard.getShipsState().length >= 5) return

        try {
          playerBoard.placeShip(startIndex, length, orientation)

          if (playerBoard.getShipsState().length === 5)
            continueBtn.removeAttribute('disabled')

          shipsTracker.push(id)

          // if ship is successfully placed, highlight all its indices
          playerBoard
            .getShipsState()
            .at(-1)
            ?.indices.forEach((index) =>
              document
                .querySelector(`.cell[data-index = ${index}]`)
                .classList.add('highlight')
            )

          resetBtn.disabled = false
          randomBtn.disabled = true
        } catch (error) {
          alert(error.message)
          // if ship placement leads to an error, remove the highlight from the cell only if it is empty
          if (
            playerBoard
              .getShipsState()
              .every((item) => !item.indices.includes(startIndex))
          )
            e.target.classList.remove('highlight')
        }

        showPlacedShips(playerBoard.getShipsState())
      })
    )

    continueBtn.addEventListener('click', () =>
      gameLoop(playerBoard, playerName)
    )

    resetBtn.addEventListener('click', () => {
      showShipsPlacingScreen(playerName)
    })

    randomBtn.addEventListener('click', (e) => {
      const randomPlacements = getRandomShipPlacement()

      randomPlacements.forEach((placement) => {
        const [startIndex, length, orientation] = placement
        playerBoard.placeShip(startIndex, length, orientation)
        showPlacedShips(playerBoard.getShipsState())
      })

      ships.forEach((ship) => ship.removeAttribute('draggable'))

      randomBtn.disabled = true
      resetBtn.disabled = false
      continueBtn.disabled = false
    })
  }

  return {
    renderBoards,
    markEnemyCellAsAttacked,
    markFriendlyCellAsAttacked,
    showEndScreen,
    showHomeScreen,
    showShipsPlacingScreen,
    showPlacedShips,
    signalEnemyTurn,
    signalPlayerTurn,
  }
})()
