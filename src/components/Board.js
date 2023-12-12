/**
 * Generates a DOM component representing the gameboard for the Battleship game.
 *
 * @returns {HTMLElement} - The board component.
 */

const Board = () => {
  const element = document.createElement('div')
  element.className = 'board'

  // Generate coordinates for each cell on the gameboard
  const coordinates = []

  for (let i = 'a'.charCodeAt(0); i <= 'j'.charCodeAt(0); i++) {
    for (let j = 1; j <= 10; j++) {
      coordinates.push(String.fromCharCode(i) + j)
    }
  }

  // Loop to create cells with coordinates
  for (let i = 0; i < 100; i++) {
    let cell = document.createElement('span')
    cell.className = 'cell'
    cell.setAttribute('data-index', coordinates[i])
    cell.textContent = coordinates[i]
    element.appendChild(cell)
  }

  return element
}

export default Board
