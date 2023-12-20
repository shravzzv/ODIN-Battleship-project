import 'normalize.css'
import './main.css'
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'
import { Interface } from './Interface'

Interface.showHomeScreen()
let playerName

// todo: Instead of this being predermined, get it data from the user.
// predermined coordinates for ships on friendly waters
const friendlyShipData = [
  ['a1', 5, 'h'],
  ['c2', 4, 'v'],
  ['j4', 4, 'h'],
  ['a8', 3, 'v'],
  ['h4', 2, 'h'],
]

// predermined coordinates for ships on enemy waters
const enemyShipData = [
  ['a2', 5, 'h'],
  ['c4', 4, 'v'],
  ['j7', 4, 'h'],
  ['e7', 3, 'v'],
  ['h1', 2, 'h'],
]

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
const gameLoop = () => {
  // create gameboards
  const friendlyBoard = Gameboard()
  const enemyBoard = Gameboard()

  // create players
  const friendlyPlayer = Player(playerName, enemyBoard)
  const enemyPlayer = ComputerPlayer(friendlyBoard)

  // place the ships on friendlyBoard
  friendlyShipData.forEach((ship) =>
    friendlyBoard.placeShip(ship[0], ship[1], ship[2])
  )
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

        document.querySelector('.restart').addEventListener('click', gameLoop)
      }
    }, 300)
  }

  document
    .querySelectorAll('.board.enemy .cell')
    .forEach((cell) => cell.addEventListener('click', attackEnemy))
}

// Start a new game after user sumbits their name
document.querySelector('.startForm').addEventListener('submit', (e) => {
  e.preventDefault()
  playerName = e.target.elements[0].value.trim()
  if (!playerName) return
  gameLoop()
})

/**
 * Bridge:
 * Make a ships placing component (take inspiration from others submissions)
 * Tie the game workflow together
 */
