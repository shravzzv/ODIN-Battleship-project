/**
 * Represents the start screen for the Battleship game.
 * @returns {HTMLElement} The HTML element representing the start screen.
 */

const StartScreen = () => {
  const element = document.createElement('div')
  element.className = 'startScreen'

  const formEl = document.createElement('form')
  formEl.className = 'startForm'

  const userNameInput = document.createElement('input')
  userNameInput.className = 'userNameInput'
  userNameInput.type = 'text'
  userNameInput.name = 'playerName'
  userNameInput.placeholder = 'Enter your name'
  userNameInput.setAttribute('required', 'true')
  userNameInput.setAttribute('autoFocus', 'true')
  formEl.appendChild(userNameInput)

  const startBtn = document.createElement('input')
  startBtn.className = 'startGameBtn'
  startBtn.type = 'submit'
  startBtn.value = 'start game'
  formEl.appendChild(startBtn)

  element.appendChild(formEl)
  return element
}

export default StartScreen
