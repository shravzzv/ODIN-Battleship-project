import Board from './Board'

/**
 * Generates a DOM component representing the game arena for the Battleship game.
 * The arena typically contains two game boards for players to interact with.
 *
 * @param {string} player1Name - The name of the friendly player.
 * @param {string} player2Name - The name of the enemy player.
 * @returns {HTMLElement} - The arena component.
 */
const Arena = (
  player1Name = 'Friendly waters',
  player2Name = 'Enemy waters'
) => {
  const element = document.createElement('div')
  element.className = 'arena'

  // the left part of the arena which friendly player occupies
  const left = document.createElement('div')

  const friendlyTitle = document.createElement('h2')
  friendlyTitle.textContent = `${player1Name}`
  left.appendChild(friendlyTitle)

  const friendlyBoard = Board()
  friendlyBoard.classList.add('friendly')
  left.appendChild(friendlyBoard)

  // the right part of the area for the enemy
  const right = document.createElement('div')

  const enemyTitle = document.createElement('h2')
  enemyTitle.textContent = `${player2Name}`
  right.appendChild(enemyTitle)

  const enemyBoard = Board()
  enemyBoard.classList.add('enemy')
  right.appendChild(enemyBoard)

  element.appendChild(left)
  element.appendChild(right)
  return element
}

export default Arena
