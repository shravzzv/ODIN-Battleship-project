import Board from './Board'

/**
 * Creates an placing ships element for the Battleship game.
 * @function
 * @returns {HTMLElement} - The place ships component.
 */
const ShipsPlacingScreen = () => {
  const element = document.createElement('div')
  element.className = 'shipsPlacingScreen'

  element.appendChild(Board())

  const continueBtn = document.createElement('button')
  continueBtn.id = 'continue'
  continueBtn.className = 'continue'
  continueBtn.textContent = 'Continue'
  element.appendChild(continueBtn)

  return element
}

export default ShipsPlacingScreen
