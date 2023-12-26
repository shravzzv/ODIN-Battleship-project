import Board from './Board'

/**
 * Creates an placing ships element for the Battleship game.
 * @function
 * @param {string} name - The player name
 * @returns {HTMLElement} - The place ships component.
 */
const ShipsPlacingScreen = (name) => {
  const element = document.createElement('div')
  element.className = 'shipsPlacingScreen'

  const heading = document.createElement('h2')
  heading.textContent = `${name}, place your ships`
  heading.className = 'heading'
  element.appendChild(heading)

  const container = document.createElement('div')
  container.className = 'container'
  element.appendChild(container)

  container.appendChild(Board())

  const shipsContainer = document.createElement('div')
  shipsContainer.className = 'shipsContainer'
  container.appendChild(shipsContainer)

  // 5 ships
  const ship1 = document.createElement('div')
  ship1.id = 'ship1'
  ship1.className = 'shipContainer'
  ship1.textContent = '🛳️🛳️🛳️🛳️🛳️'
  ship1.setAttribute('draggable', true)
  ship1.setAttribute('data-length', 5)
  ship1.setAttribute('data-orientation', 'h')

  const ship2 = document.createElement('div')
  ship2.id = 'ship2'
  ship2.className = 'shipContainer vertical'
  ship2.textContent = '🛳️🛳️🛳️🛳️'
  ship2.setAttribute('draggable', true)
  ship2.setAttribute('data-length', 4)
  ship2.setAttribute('data-orientation', 'v')

  const ship3 = document.createElement('div')
  ship3.id = 'ship3'
  ship3.className = 'shipContainer'
  ship3.textContent = '🛳️🛳️🛳️🛳️'
  ship3.setAttribute('draggable', true)
  ship3.setAttribute('data-length', 4)
  ship3.setAttribute('data-orientation', 'h')

  const ship4 = document.createElement('div')
  ship4.id = 'ship4'
  ship4.className = 'shipContainer'
  ship4.textContent = '🛳️🛳️🛳️'
  ship4.setAttribute('draggable', true)
  ship4.setAttribute('data-length', 3)
  ship4.setAttribute('data-orientation', 'h')

  const ship5 = document.createElement('div')
  ship5.id = 'ship5'
  ship5.className = 'shipContainer vertical'
  ship5.textContent = '🛳️🛳️'
  ship5.setAttribute('draggable', true)
  ship5.setAttribute('data-length', 2)
  ship5.setAttribute('data-orientation', 'v')

  shipsContainer.appendChild(ship1)
  shipsContainer.appendChild(ship5)
  shipsContainer.appendChild(ship2)
  shipsContainer.appendChild(ship3)
  shipsContainer.appendChild(ship4)

  const buttons = document.createElement('div')
  buttons.className = 'buttons'
  element.appendChild(buttons)

  const continueBtn = document.createElement('button')
  continueBtn.id = 'continue'
  continueBtn.className = 'continue'
  continueBtn.textContent = 'Continue'
  continueBtn.setAttribute('disabled', true)
  buttons.appendChild(continueBtn)

  const resetBtn = document.createElement('button')
  resetBtn.id = 'reset'
  resetBtn.className = 'reset'
  resetBtn.textContent = 'Reset'
  resetBtn.disabled = true
  buttons.appendChild(resetBtn)

  return element
}

export default ShipsPlacingScreen
