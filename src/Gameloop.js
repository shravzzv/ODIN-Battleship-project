import 'normalize.css'
import './main.css'
import { Player } from './modules/Player'
import { Gameboard } from './modules/Gameboard'
import { ComputerPlayer } from './modules/ComputerPlayer'
import { Interface } from './modules/Interface'
import getRandomShipPlacement from './utils/randomShipPlacement'

Interface.showHomeScreen()

/**
 * Executes the main game loop for the Battleship game.
 * @param {Object} friendlyBoard - The gameboard object of the player.
 * @param {string} playerName - The name of the player.
 */
const gameLoop = (friendlyBoard, playerName) => {
  // create gameboards
  const enemyBoard = Gameboard()

  // create players
  const friendlyPlayer = Player(playerName, enemyBoard)
  const enemyPlayer = ComputerPlayer(friendlyBoard)

  // random coordinates for ships on enemy waters
  const enemyShipData = getRandomShipPlacement()

  // place the ships on enemyboard
  enemyShipData.forEach((ship) =>
    enemyBoard.placeShip(ship[0], ship[1], ship[2])
  )

  // display friendlyBoard and enemyBoard in the UI
  Interface.renderBoards(friendlyBoard, enemyBoard)

  /**
   * Flag to control whether the player can make a move or needs to wait for the enemy's turn.
   * @type {boolean}
   */
  let waitForEnemyTurn = false

  /**
   * Handles the attack on the enemy board when a cell is clicked.
   *
   * @param {Event} e - The click event.
   */
  const attackEnemy = (e) => {
    const index = e.target.attributes['data-index'].value
    if (e.target.classList.contains('attacked')) return

    friendlyPlayer.attack(index)
    Interface.markEnemyCellAsAttacked(index)
    waitForEnemyTurn = true

    setTimeout(() => {
      enemyPlayer.attack()
      Interface.markFriendlyCellAsAttacked(enemyPlayer.getLastAttack().index)

      // Game finished
      if (friendlyBoard.areAllShipsSunk() || enemyBoard.areAllShipsSunk()) {
        document
          .querySelectorAll('.board.enemy .cell')
          .forEach((cell) => cell.removeEventListener('click', attackEnemy))

        Interface.showEndScreen(enemyBoard.areAllShipsSunk(), playerName)

        document.querySelector('#restart').addEventListener('click', (e) => {
          Interface.showShipsPlacingScreen(playerName)
          enableShipsPlacementScreenEventListeners(playerName)
        })
      }
      waitForEnemyTurn = false
    }, 1000)
  }

  document.querySelectorAll('.board.enemy .cell').forEach((cell) =>
    cell.addEventListener('click', (e) => {
      if (!waitForEnemyTurn) attackEnemy(e)
    })
  )
}

// Event listener for the home screen
document.querySelector('.startForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const playerName = e.target.elements.playerName.value.trim()
  if (!playerName) return

  Interface.showShipsPlacingScreen(playerName)
  enableShipsPlacementScreenEventListeners(playerName)
})

/**
 * Places event listeners on the ships placement screen.
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
      e.target.setAttribute('data-orientation', orientation === 'h' ? 'v' : 'h')
      e.target.classList.toggle('vertical')
    })
  )

  // allows ships to be dragged, and send data during drag
  ships.forEach((ship) =>
    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('plain-text', e.target.id)
      e.dataTransfer.setData('number', e.target.getAttribute('data-length'))
      e.dataTransfer.setData('text', e.target.getAttribute('data-orientation'))

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

      Interface.showPlacedShips(playerBoard.getShipsState())
    })
  )

  continueBtn.addEventListener('click', () => gameLoop(playerBoard, playerName))

  resetBtn.addEventListener('click', () => {
    Interface.showShipsPlacingScreen(playerName)
    enableShipsPlacementScreenEventListeners(playerName)
  })

  randomBtn.addEventListener('click', (e) => {
    const randomPlacements = getRandomShipPlacement()

    randomPlacements.forEach((placement) => {
      const [startIndex, length, orientation] = placement
      playerBoard.placeShip(startIndex, length, orientation)
      Interface.showPlacedShips(playerBoard.getShipsState())
    })

    ships.forEach((ship) => ship.removeAttribute('draggable'))

    randomBtn.disabled = true
    resetBtn.disabled = false
    continueBtn.disabled = false
  })
}

// don't allow player turn before enemy has made a move
