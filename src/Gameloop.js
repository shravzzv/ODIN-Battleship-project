import 'normalize.css'
import './main.css'
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'
import { Interface } from './Interface'

Interface.showHomeScreen()
let playerName

/**
 * Checks if the game is finished based on the status of both friendly and enemy gameboards.
 *
 * @param {Object} friendlyBoard - The friendly player's gameboard.
 * @param {Object} enemyBoard - The enemy player's gameboard.
 * @returns {boolean} True if either all friendly or all enemy ships are sunk, indicating the end of the game.
 */
const isGameFinished = (friendlyBoard, enemyBoard) =>
  friendlyBoard.areAllShipsSunk() || enemyBoard.areAllShipsSunk()

/**
 * Executes the main game loop for the Battleship game.
 */
const gameLoop = (friendlyBoard) => {
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

      if (isGameFinished(friendlyBoard, enemyBoard)) {
        document
          .querySelectorAll('.board.enemy .cell')
          .forEach((cell) => cell.removeEventListener('click', attackEnemy))

        Interface.showEndScreen(enemyBoard.areAllShipsSunk(), playerName)

        document.querySelector('#restart').addEventListener('click', (e) => {
          Interface.showShipsPlacingScreen()
          enableShipsPlacementScreenEventListeners()
        })
      }
    }, 300)
  }

  document
    .querySelectorAll('.board.enemy .cell')
    .forEach((cell) => cell.addEventListener('click', attackEnemy))
}

// Start a new game after user sumbits their name & places ships
document.querySelector('.startForm').addEventListener('submit', (e) => {
  e.preventDefault()
  playerName = e.target.elements.playerName.value.trim()
  if (!playerName) return

  Interface.showShipsPlacingScreen()
  enableShipsPlacementScreenEventListeners()
})

/**
 * Places event listeners on the ships placement screen.
 */
const enableShipsPlacementScreenEventListeners = () => {
  const continueBtn = document.querySelector('#continue')

  const shipsData = []
  const dummyBoard = Gameboard()
  const lengths = [2, 3, 4, 4, 5]

  document.querySelectorAll('.cell').forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const index = e.target.attributes['data-index'].value
      if (shipsData.length >= 5) return

      try {
        let start = index
        let length = lengths.at(-1)
        let orientation = Math.round(Math.random()) ? 'h' : 'v'

        dummyBoard.placeShip(start, length, orientation)
        shipsData.push([start, length, orientation])
        lengths.pop()
        if (shipsData.length === 5) {
          continueBtn.removeAttribute('disabled')
        }
      } catch (error) {
        console.log(error)
      }

      Interface.showPlacedShips(dummyBoard.getShipsState())
    })
  )

  continueBtn.addEventListener('click', (e) => gameLoop(dummyBoard))
}

/**
 * Bridge:
 * Make a ships placing component (take inspiration from others submissions)
 * Tie the game workflow together
 */
