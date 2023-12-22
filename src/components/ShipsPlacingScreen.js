import Board from './Board'

/**
 * Creates an placing ships element for the Battleship game.
 * @function
 * @returns {HTMLElement} - The place ships component.
 */
const ShipsPlacingScreen = () => {
  const element = document.createElement('div')
  element.className = 'shipsPlacingScreen'

  const heading = document.createElement('h2')
  heading.textContent = 'Place your ships'
  element.appendChild(heading)

  element.appendChild(Board())

  const continueBtn = document.createElement('button')
  continueBtn.id = 'continue'
  continueBtn.className = 'continue'
  continueBtn.textContent = 'Continue'
  continueBtn.setAttribute('disabled', true)
  element.appendChild(continueBtn)

  return element
}

export default ShipsPlacingScreen
