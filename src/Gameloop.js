// STYLES
import 'normalize.css'
import './main.css'

// MODULES
import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { ComputerPlayer } from './ComputerPlayer'

import { Interface } from './Interface'

// create gameboards
const friendlyBoard = Gameboard()
const enemyBoard = Gameboard()

// create players
const friendly = Player('friendly', enemyBoard)
const enemy = ComputerPlayer(friendlyBoard)

// Initialize the UI
Interface.initialize(friendly, enemy, friendlyBoard, enemyBoard)

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

// place the ships on each gameboard
friendlyShipData.forEach((ship) =>
  friendlyBoard.placeShip(ship[0], ship[1], ship[2])
)
enemyShipData.forEach((ship) => enemyBoard.placeShip(ship[0], ship[1], ship[2]))

// represent the ships in UI
Interface.placeShipsOnFriendlyBoard(friendlyBoard.getShipsState())
Interface.placeShipsOnEnemyBoard(enemyBoard.getShipsState())
