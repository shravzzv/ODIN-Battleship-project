import { Gameboard } from '../modules/Gameboard'

/**
 * Returns valid random indices for ships placement on a board.
 *
 * @returns {Array[]} - An array of arrays
 */

const getRandomShipPlacement = () => {
  const result = []
  const lengths = [5, 4, 4, 3, 2]
  const board = Gameboard()

  lengths.forEach((length) => {
    let placed = false

    while (!placed) {
      const randomIndex = getRandomIndex()
      const orientation = Math.round(Math.random()) ? 'h' : 'v'
      try {
        board.placeShip(randomIndex, length, orientation)
        result.push([randomIndex, length, orientation])
        placed = true
      } catch (error) {}
    }
  })

  return result
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomIndex = () => {
  const coordinatesArray = []

  // Generate all possible coordinates on the game board.
  for (let i = 'a'.charCodeAt(0); i <= 'j'.charCodeAt(0); i++) {
    for (let j = 1; j <= 10; j++) {
      coordinatesArray.push(String.fromCharCode(i) + j)
    }
  }

  // Select a random index from the coordinates array.
  return coordinatesArray.at(getRandomIntInclusive(0, 99))
}

export default getRandomShipPlacement
