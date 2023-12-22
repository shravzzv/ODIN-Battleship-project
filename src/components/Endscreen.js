/**
 * Creates an end screen element for the Battleship game.
 * @function
 * @param {boolean} isWon - A flag indicating whether the player has won the game.
 * @param {string} name - The name of the player.
 * @returns {HTMLElement} - The end screen element containing congratulatory or loss message and a restart button.
 */
const EndScreen = (isWon, name) => {
  const element = document.createElement('div')
  element.className = 'endScreen'

  const winText = document.createElement('h2')
  winText.className = 'winText'
  winText.textContent = `Congratulations ${name}! You've won! 🎉 Wanna win again?`

  const lossText = document.createElement('h2')
  lossText.className = 'lossText'
  lossText.textContent = `OOPS! You've lost ${name}! Have another go at it.`

  isWon ? element.appendChild(winText) : element.appendChild(lossText)

  const restartBtn = document.createElement('button')
  restartBtn.id = 'restart'
  restartBtn.className = 'restart'
  restartBtn.textContent = 'Restart'
  element.appendChild(restartBtn)

  const restartBtnWithNewShips = document.createElement('button')
  restartBtnWithNewShips.id = 'restartWithNewShips'
  restartBtnWithNewShips.className = 'restart'
  restartBtnWithNewShips.textContent = 'Change ships placement and restart'
  element.appendChild(restartBtnWithNewShips)

  return element
}

export default EndScreen
