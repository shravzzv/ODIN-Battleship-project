import 'normalize.css'
import './main.css'
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'
import { Interface } from './Interface'

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
  const friendlyPlayer = Player('John', enemyBoard)
  const enemyPlayer = ComputerPlayer(friendlyBoard)

  // todo: Instead of this being predermined, get it data from the user.
  // predermined coordinates for friendly ships
  const friendlyShipData = [
    ['a1', 5, 'h'],
    ['c2', 4, 'v'],
    ['j4', 4, 'h'],
    ['a8', 3, 'v'],
    ['h4', 2, 'h'],
  ]
  // predermined coordinates for enemy ships
  const enemyShipData = [
    ['a2', 5, 'h'],
    ['c4', 4, 'v'],
    ['j7', 4, 'h'],
    ['e7', 3, 'v'],
    ['h1', 2, 'h'],
  ]

  // place the ships on friendlyBoard's predetermined coordinates
  friendlyShipData.forEach((ship) =>
    friendlyBoard.placeShip(ship[0], ship[1], ship[2])
  )
  // place the ships on enemyboard's predetermined coordinates
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

        Interface.displayEndScreen(enemyBoard.areAllShipsSunk())

        document.querySelector('.restart').addEventListener('click', gameLoop)
      }
    }, 300)
  }

  document
    .querySelectorAll('.board.enemy .cell')
    .forEach((cell) => cell.addEventListener('click', attackEnemy))
}

Interface.welcomeUser()
document.querySelector('.startForm').addEventListener('submit', gameLoop)

/**
 * Bridge:
 * Complete start screen
 * Complete end screen
 * Make a ships placing component
 * Tie the game workflow together
 */
