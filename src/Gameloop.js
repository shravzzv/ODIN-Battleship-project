import 'normalize.css'
import './main.css'
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'
import { Interface } from './Interface'

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

  // predermined coordinates for ships on enemy waters
  const enemyShipData = [
    ['a2', 5, 'h'],
    ['c4', 4, 'v'],
    ['j7', 4, 'h'],
    ['e7', 3, 'v'],
    ['h1', 2, 'h'],
  ]
  // place the ships on enemyboard
  enemyShipData.forEach((ship) =>
    enemyBoard.placeShip(ship[0], ship[1], ship[2])
  )

  // display friendlyBoard and enemyBoard in the UI
  Interface.renderBoards(friendlyBoard, enemyBoard)

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
          Interface.showShipsPlacingScreen()
          enableShipsPlacementScreenEventListeners(playerName)
        })
      }
    }, 300)
  }

  document
    .querySelectorAll('.board.enemy .cell')
    .forEach((cell) => cell.addEventListener('click', attackEnemy))
}

// Event listener for the home screen
document.querySelector('.startForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const playerName = e.target.elements.playerName.value.trim()
  if (!playerName) return

  Interface.showShipsPlacingScreen()
  enableShipsPlacementScreenEventListeners(playerName)
})

/**
 * Places event listeners on the ships placement screen.
 */
const enableShipsPlacementScreenEventListeners = (playerName) => {
  const cells = document.querySelectorAll('.cell')
  const continueBtn = document.querySelector('#continue')
  const ships = document.querySelectorAll('.shipContainer')
  const playerBoard = Gameboard()
  const shipsTracker = []

  // ! you're not actually dragging anything.

  cells.forEach((cell) => cell.setAttribute('draggable', true))

  ships.forEach((ship) =>
    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', e.target.getAttribute('data-orientation'))
      e.dataTransfer.setData('number', e.target.getAttribute('data-length'))
      e.dataTransfer.setData('plain-text', e.target.id)
    })
  )

  ships.forEach((ship) =>
    ship.addEventListener('click', (e) => {
      const orientation = e.target.getAttribute('data-orientation')
      e.target.setAttribute('data-orientation', orientation === 'h' ? 'v' : 'h')
      e.target.classList.toggle('vertical')
    })
  )

  // remove ships placed on the board
  ships.forEach((ship) =>
    ship.addEventListener('dragend', (e) => {
      if (shipsTracker.includes(e.target.id)) e.target.remove()
    })
  )

  cells.forEach((cell) =>
    cell.addEventListener('dragstart', (e) => {
      // todo: be able to drag ships within the board
    })
  )

  cells.forEach((cell) =>
    cell.addEventListener('dragover', (e) => {
      e.preventDefault()
      // todo: show invalid cells in the UI to drag onto
    })
  )

  cells.forEach((cell) =>
    cell.addEventListener('drop', (e) => {
      const startIndex = e.target.attributes['data-index'].value
      const length = parseInt(e.dataTransfer.getData('number'))
      const orientation = e.dataTransfer.getData('text')
      const id = e.dataTransfer.getData('plain-text')

      if (!length || !orientation) return
      if (playerBoard.getShipsState().length >= 5) return

      try {
        playerBoard.placeShip(startIndex, length, orientation)

        if (playerBoard.getShipsState().length === 5)
          continueBtn.removeAttribute('disabled')

        shipsTracker.push(id)
      } catch (error) {
        console.log(error)
        alert(error.message)
        // todo: show error messages in the UI.
      }

      Interface.showPlacedShips(playerBoard.getShipsState())
    })
  )

  continueBtn.addEventListener('click', () => gameLoop(playerBoard, playerName))
}

/**
 * Bridge:
 * Make the drag UI work.
 * Make ships dragabble after placing them on the board.
 * Display available and unavailable cells.
 */
