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

  // place random coordinates for ships on enemy waters
  getRandomShipPlacement()?.forEach((ship) =>
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
      Interface.signalEnemyTurn()
    }, 300)

    setTimeout(() => {
      enemyPlayer.attack()
      Interface.markFriendlyCellAsAttacked(enemyPlayer.getLastAttack().index)
      waitForEnemyTurn = false

      setTimeout(() => {
        // Game finished
        if (friendlyBoard.areAllShipsSunk() || enemyBoard.areAllShipsSunk()) {
          Interface.showEndScreen(enemyBoard.areAllShipsSunk(), playerName)
        } else Interface.signalPlayerTurn()
      }, 300)
    }, 1500)
  }

  document.querySelectorAll('.board.enemy .cell').forEach((cell) =>
    cell.addEventListener('click', (e) => {
      if (!waitForEnemyTurn) attackEnemy(e)
    })
  )
}

export default gameLoop
