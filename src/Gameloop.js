import 'normalize.css'
import './main.css'
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'
import { Interface } from './Interface'

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

  // place the ships on friendlyBoard
  friendlyShipData.forEach((ship) =>
    friendlyBoard.placeShip(ship[0], ship[1], ship[2])
  )
  // place the ships on enemyboard
  enemyShipData.forEach((ship) =>
    enemyBoard.placeShip(ship[0], ship[1], ship[2])
  )

  Interface.initialize(friendlyBoard, enemyBoard)
  // while (!isGameFinished(friendlyBoard, enemyBoard)) {}

  if (isGameFinished(friendlyBoard, enemyBoard)) displayWinner(friendlyBoard)
}

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
 * Displays a winner message based on the status of the friendly player's gameboard.
 *
 * @param {Object} friendlyBoard - The friendly player's gameboard.
 */
const displayWinner = (friendlyBoard) =>
  alert(
    friendlyBoard.areAllShipsSunk()
      ? 'OOPS! The enemy sunk all your ships!'
      : 'HURRAY! You sunk all the enemy ships! Bravo!'
  )

gameLoop()
