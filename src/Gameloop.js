// STYLES
import 'normalize.css'
import './main.css'

// MODULES
import { Interface } from './Interface'
import { Gameboard } from './Gameboard'
import { Player } from './Player'
import { ComputerPlayer } from './ComputerPlayer'

Interface.initialize()

const board1 = Gameboard()
const board2 = Gameboard()

const player1 = Player('player1', board2)
const player2 = ComputerPlayer(board1)

// predermined coordinates for ships
const shipData = [
  ['a1', 5, 'h'],
  ['c2', 4, 'v'],
  ['j4', 4, 'h'],
  ['a8', 3, 'v'],
  ['h4', 2, 'h'],
]

for (const ship of shipData) {
  board1.placeShip(ship[0], ship[1], ship[2])
  board2.placeShip(ship[0], ship[1], ship[2])
}

Interface.placeShips(board1.getShipsState())

console.log(board1.getShipsState())
console.log(board2.getShipsState())

const isGameFinished = () =>
  board1.areAllShipsSunk() || board2.areAllShipsSunk()

const coordinatesArray = []

for (let i = 'a'.charCodeAt(0); i <= 'j'.charCodeAt(0); i++) {
  for (let j = 1; j <= 10; j++) {
    const coordinate = String.fromCharCode(i) + j
    coordinatesArray.push(coordinate)
  }
}

let i = 0
while (!isGameFinished()) {
  player1.attack(coordinatesArray[i++])
  player2.attack()
}

console.log(player2.getAttacks())

if (isGameFinished()) {
  // find and display winner
  const winner = board1.areAllShipsSunk() ? 'player2' : 'player1'
  console.log(`${winner} has won!`)
}
