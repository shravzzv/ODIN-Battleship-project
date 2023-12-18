const EndScreen = (isWon) => {
  const element = document.createElement('div')
  element.className = 'endScreen'

  const winText = document.createElement('h2')
  winText.className = 'winText'
  winText.textContent = 'Congratulations! You won! 🎉 Wanna win again?'

  const lossText = document.createElement('h2')
  lossText.className = 'lossText'
  lossText.textContent = 'OOPS! You lost! Have another go at it.'

  isWon ? element.appendChild(winText) : element.appendChild(lossText)

  const restartBtn = document.createElement('button')
  restartBtn.className = 'restart'
  restartBtn.textContent = 'Restart'
  element.appendChild(restartBtn)

  return element
}

export default EndScreen
